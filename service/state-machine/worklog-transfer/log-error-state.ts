import { State, StateEvent, StateContext, StateCallback } from '../state';

export class LogErrorState extends State {
    async handler(event: StateEvent, context: StateContext, callback: StateCallback) {
        console.error("Error while running the Worklog Transfer state machine. Error:", event);
    }
}

