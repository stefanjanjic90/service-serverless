import * as AWS from 'aws-sdk';
import { LambdaContainer, LambdaHandler, ContainerInstance } from 'tyx';
import { Environment } from '../environment';
import { LambdaHandlerParameter } from './lambda-handler-parameter';
import * as _ from 'lodash';

export class ApplicationContainer {

    public static readonly ApplicationName: string = "rexor-integration-service";

    private lambdaContainer: LambdaContainer;
    private onInitializationCallback: (lambdaContainer: LambdaContainer) => void;

    constructor() {
        AWS.config.update({ region: Environment.region });
    }

    public export(): LambdaHandler {
        return (event, context, callback): boolean | void => {
            try {
                if (this.isLambdaWarmUp(event)) {
                    console.log("Lambda WarmUp!");
                    return callback(null, 'success');
                } else {
                    this.lambdaContainer = new LambdaContainer(ApplicationContainer.ApplicationName);
                    this.lambdaContainer.register(event, LambdaHandlerParameter.Event);
                    this.lambdaContainer.register(context, LambdaHandlerParameter.Context);
                    if (this.onInitializationCallback) {
                        this.onInitializationCallback(this.lambdaContainer);
                    }
                    let lambdaHandler: LambdaHandler = this.lambdaContainer.export();
                    return lambdaHandler(event, context, callback);
                }
            } catch (exception) {
                console.log("Error while exporting Lambda Hanlder.", exception);
                throw exception;
            }
        }
    }

    public prepare(): ContainerInstance {
        this.lambdaContainer = new LambdaContainer(ApplicationContainer.ApplicationName);
        if (this.onInitializationCallback) {
            this.onInitializationCallback(this.lambdaContainer);
        }
        return this.lambdaContainer.prepare();
    }

    public get onInitialization(): (lambdaContainer: LambdaContainer) => void {
        return this.onInitializationCallback;
    }

    public set onInitialization(onInitializationCallback: (lambdaContainer: LambdaContainer) => void) {
        this.onInitializationCallback = onInitializationCallback;
    }

    private isLambdaWarmUp(event) {
        return !_.isEmpty(event) && !_.isEmpty(event.source) && _.isEqual(event.source, "aws.events");
    }
}