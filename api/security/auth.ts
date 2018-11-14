import { Context, RestCall, RestResult } from 'tyx';

export const AuthApi = "Auth";

/**
 * Authentication interface for Rexor integration application.
 * Processes authorization request using Express.js and Passport.js for Azure Active Directory.
 */
export interface AuthApi {

    /**
     * Proccess Express.js authorization request with Passport.js.
     * Three Express application paths are provided for this purpose:
     * 1) /login - initiates the login of the user and redirects user to Azure login page.
     * 2) /token - replay path after user successfully authorizes with Azure Active Directory.
     * 3) /logout - releases token and redirects user to Azure login page.
     * @param context Context object provided by TyX.
     * @param call TyX rest call object which holds information about the http request.
     * @returns Promise of a TyX rest result.
     */
    processExpressRequest(context: Context, call: RestCall): Promise<RestResult>;
}