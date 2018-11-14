import { StepFunctions } from "aws-sdk";

export const StateMachineApi = "StateMachine";

/**
 * Defines methods for working with AWS Step Functions state machines.
 */
export interface StateMachineApi {

    /**
     * Checks if a given execution of state machine is running.
     * @param stateMachineArn AWS ARN of Step Function.
     * @param executionNamePrefix Unique name prefix of the execution. Name is defined at the start of state machine execution.
     * @return Promise of a Boolean, indicating execution state.
     */
    isRunning(stateMachineArn: string, executionNamePrefix: string): Promise<Boolean>
    
    /**
     * Start new instance of execution for a state machine.
     * @param stateMachineArn AWS ARN of the Step Function.
     * @param executionName Unique name which identifies the execution.
     * @param input Stringified JSON object used as input to state machine. If nothing is provided, empty object will be passed.
     * @return Promise of successfull start of execution. 
     */
    startExecution(stateMachineArn: string, executionName: string, input?: string): Promise<StepFunctions.StartExecutionOutput>
}