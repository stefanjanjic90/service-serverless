import * as superagent from 'superagent';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem'
import { Environment } from "../../environment";

export const handler = async function (event, context, callback) {
    const token = event.authorizationToken;

    let publicKeys = await superagent.get(Environment.azureJwksUrl)
        .then(function (response) {
            return response.body.keys;
        }, function (error) {
            console.log('Azure public key request error.', error);
            throw error;
        });

    let decodedToken: any;
    try {
        decodedToken = jwt.decode(token, { json: true, complete: true }) as any;
    } catch (exception) {
        console.log("JWT decode error.", exception);
        throw exception;
    }

    let publicKey = publicKeys.filter(function (key) {
        return key.kid === decodedToken.header.kid;
    })[0];

    if (!publicKey) {
        let errorMessage = "Token public key does not match any of the retreived Azure public keys.";
        console.log(errorMessage);
        return callback('Unauthorized');

    }

    let pemKey: any;
    try {
        pemKey = jwkToPem(publicKey)
    } catch (exception) {
        console.log("JWK to PEM conversion failed.", exception);
        throw new Error(exception);
    }

    jwt.verify(token, pemKey, function (error, data) {
        console.log(error);
        if (!error && data && data.sub && data.amr) {
            return callback(null, generatePolicyDocument(data, 'Allow', event.methodArn));
        }
        return callback('Unauthorized');
    });
};

function generatePolicyDocument(data, effect, resource) {
    return {
        principalId: data.sub,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }],
        },
        context: {
            userId: data.unique_name,
            userName: data.name
        }
    };
}