import { LambdaContext, LambdaCallback, ContainerInstance } from 'tyx';

export interface StateEvent {
    [key: string]: any
};
export interface StateContext extends LambdaContext { };
export interface StateCallback extends LambdaCallback { };

export interface StateHandler {
    (event: StateEvent, context: StateContext, callback: StateCallback): boolean | void;
}

export abstract class State {

    protected containerInstance: ContainerInstance;

    constructor(containerInstance?: ContainerInstance) {
        this.containerInstance = containerInstance;
    }

    exportHandler(): StateHandler {
        return (event: StateEvent, context: StateContext, callback: StateCallback) => {
            return this.handler.call(this, event, context, callback);
        };
    }

    abstract async handler(event: StateEvent, context: StateContext, callback: StateCallback);
}