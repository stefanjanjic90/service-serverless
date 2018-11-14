import {
    Service,
    Context,
    ContentType,
    Get,
    RestCall,
    RestResult,
    Public,
    ExpressService
} from 'tyx';

import express = require('express');
import awsServerlessExpress = require('aws-serverless-express');
import { Environment } from '../../environment';
import { AuthApi } from '../../api/security';
import { InternalErrorException } from '../../exception';

const Passport = require('passport');
const CookieParser = require('cookie-parser');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

@Service()
export class AuthService extends ExpressService implements AuthApi {

    private static readonly rootPath = '/';
    private static readonly loginPath = '/login';
    private static readonly logoutPath = '/logout';
    private static readonly tokenPath = '/token';

    private httpServer;

    private strategy: any;

    constructor() {
        super();
        this.strategy = this.getLoginStrategy();
    }

    @Public()
    @Get(AuthService.loginPath, (next, context, call) => next(context, call))
    @Get(AuthService.logoutPath, (next, context, call) => next(context, call))
    @Get(AuthService.tokenPath, (next, context, call) => next(context, call))
    @ContentType('RAW')
    public async processExpressRequest(context: Context, call: RestCall): Promise<RestResult> {
        let result: RestResult = await this.process(context, call);
        return result;
    }

    protected setup(app: express.Express, context: Context, call: RestCall): void {
        let self = this;
        app.use(Passport.initialize());
        app.use(Passport.session());
        app.use(CookieParser());
        Passport.use(self.strategy);

        app.get(
            [AuthService.loginPath],
            function (request, response, next) {
                Passport.authenticate(self.strategy.name,
                    {
                        session: false,
                        response: response,
                        failureRedirect: AuthService.rootPath
                    },
                    function (error, user, info) {
                        if (error) {
                            console.error(error);
                        }
                    }
                )(request, response, next);
            },
            function (request, response) {
                response.redirect(AuthService.rootPath);
            }
        );

        app.get(
            [AuthService.tokenPath],
            (request, response, next) => {
                Passport.authenticate(self.strategy.name,
                    {
                        session: false,
                        response: response,
                        failureRedirect: AuthService.rootPath
                    }
                )(request, response, next);
            },
            async (request, response) => {
                try {
                    let tokens = {
                        azure: request.query.id_token,
                    };
                    let tokensQueryParam = `/?tokens=${encodeURIComponent(JSON.stringify(tokens))}`;
                    response.redirect(Environment.webappUrl + tokensQueryParam);
                } catch (exception) {
                    console.error(exception);
                    let internalErrorException = new InternalErrorException(exception);
                    throw internalErrorException.convertToTyxException();
                }
            }
        );

        app.get(
            [AuthService.logoutPath],
            function (request, response, next) {
                response.redirect(Environment.azureLogoutUrl + encodeURIComponent(Environment.webappUrl));
            }
        );
    }

    protected process(context: Context, call: RestCall): Promise<RestResult> {
        let resource = call.resource;
        if (resource.indexOf("{") > 0) resource = resource.substring(0, resource.indexOf("{") - 1);
        call.path = call.path.substring(call.path.indexOf(resource));
        for (let queryParameter in call.queryStringParameters) {
            call.queryStringParameters[queryParameter] = encodeURIComponent(call.queryStringParameters[queryParameter]);
        }

        let app: express.Express = express();

        this.setup(app, context, call);

        return new Promise<RestResult>((resolve, reject) => {
            this.httpServer = awsServerlessExpress.createServer(app);
            this.httpServer.timeout = 0;
            awsServerlessExpress.proxy(this.httpServer, call, {
                succeed: (input) => resolve({
                    statusCode: input.statusCode,
                    headers: input.headers,
                    body: input.body
                }),
                fail: (error) => reject(error)
            } as any);
        });
    }

    public release(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.httpServer) {
                this.httpServer.close();
                this.httpServer = undefined;
                return resolve();
            }
        });
    }

    private getLoginStrategy() {
        return new OIDCStrategy(
            {
                identityMetadata: Environment.azureAuthConfigIdentityMetadata,
                clientID: Environment.azureAuthConfigClientID,
                responseType: Environment.azureAuthConfigResponseType,
                responseMode: Environment.azureAuthConfigResponseMode,
                redirectUrl: Environment.apiGatewayUrl + AuthService.tokenPath,
                allowHttpForRedirectUrl: Environment.azureAuthConfigAllowHttpForRedirectUrl,
                clientSecret: Environment.azureAuthConfigClientSecret,
                validateIssuer: Environment.azureAuthConfigValidateIssuer,
                isB2C: Environment.azureAuthConfigIsB2C,
                passReqToCallback: Environment.azureAuthConfigPassReqToCallback,
                scope: [
                    Environment.azureAuthConfigScopeOpenId,
                    Environment.azureAuthConfigScopeOfflineAccess
                ],
                loggingLevel: Environment.azureAuthConfigLoggingLevel,
                nonceMaxAmount: Environment.azureAuthConfigNonceMaxAmount,
                useCookieInsteadOfSession: Environment.azureAuthConfigUseCookieInsteadOfSession,
                cookieEncryptionKeys: [
                    {
                        "key": Environment.azureAuthConfigCookieEncryptionKey1,
                        "iv": Environment.azureAuthConfigCookieEncryptionIv1
                    },
                    {
                        "key": Environment.azureAuthConfigCookieEncryptionKey2,
                        "iv": Environment.azureAuthConfigCookieEncryptionIv2
                    }
                ]

            },
            function (iss, sub, profile, accessToken, refreshToken, done) {
                if (!profile.oid) {
                    return done(new Error("No oid found"), null);
                }
                return done(null, true);
            });
    }
}