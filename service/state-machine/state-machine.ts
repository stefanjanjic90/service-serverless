import { Service, Internal } from "tyx";
import { StateMachineApi } from '../../api/state-machine'
import { ExecutionStatus } from '../../constants/state-machine'
import { StepFunctions } from "aws-sdk";
import * as _ from 'lodash';

@Service(StateMachineApi)
export class StateMachineService implements StateMachineApi {

    private stepFunctions: StepFunctions;

    constructor() {
        this.stepFunctions = new StepFunctions({ apiVersion: '2016-11-23' });
    }

    @Internal()
    public async isRunning(stateMachineArn: string, executionNamePrefix: string): Promise<Boolean> {
        try {
            let listExecutionsResponse = await this.stepFunctions.listExecutions({
                stateMachineArn: stateMachineArn,
                statusFilter: ExecutionStatus.Running
            }).promise();

            let execution = _.find(listExecutionsResponse.executions, (execution) => { return _.startsWith(execution.name, executionNamePrefix); });
            return !_.isEmpty(execution);
        } catch (exception) {
            console.error("Failed to check status of state machine.", exception);
            throw exception;
        }
    }

    @Internal()
    public async startExecution(stateMachineArn: string, executionName: string, input?: string): Promise<StepFunctions.StartExecutionOutput> {
        try {
            if (_.isEmpty(input)) {
                input = JSON.stringify({});
            }
            return this.stepFunctions.startExecution({
                stateMachineArn: stateMachineArn,
                name: executionName,
                input
            }).promise();
        } catch (exception) {
            console.error(
                `Unable to start state machine execution. 
                ARN: ${stateMachineArn}
                Execution Name: ${executionName}
                Input: ${input}`,
                exception);
            throw exception;
        }
    }

}
