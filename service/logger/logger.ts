import { CloudWatchLogs } from 'aws-sdk';
import { Environment } from '../../environment';
import * as moment from 'moment';

export abstract class Logger {

    private readonly logGroupName: string;
    private readonly cloudWatchLogs: CloudWatchLogs

    constructor() {
        this.logGroupName = Environment.applicationLogGroupName;
        this.cloudWatchLogs = new CloudWatchLogs({ apiVersion: '2014-03-28' })
    }

    protected async insertLog(message: string): Promise<any> {
        try {
            let logStreamName = await this.getLogStreamName();

            let describeLogStreamParams: CloudWatchLogs.DescribeLogStreamsRequest = {
                logGroupName: this.logGroupName,
                logStreamNamePrefix: logStreamName
            };

            let logStreamDescribeResponse = await this.cloudWatchLogs.describeLogStreams(describeLogStreamParams).promise();

            let logStream = logStreamDescribeResponse.logStreams.filter((logStream) => {
                return logStream.logStreamName === logStreamName;
            })[0];

            if (!logStream) {
                console.log(`Cloud not find log stream: ${logStreamName}. Tried to log message: ${message}`);
                return;
            }

            let uploadSequenceToken = logStream.uploadSequenceToken;

            let logStreamEventParams: CloudWatchLogs.PutLogEventsRequest = {
                logGroupName: this.logGroupName,
                logStreamName: logStreamName,
                logEvents: [{
                    message: message,
                    timestamp: Date.now()
                }],
                sequenceToken: uploadSequenceToken
            };

            return this.cloudWatchLogs.putLogEvents(logStreamEventParams).promise();

        } catch (exception) {
            console.log(`Unable to log message. Message: ${message}`, exception);
            return;
        }
    }

    protected getTimeMessage(): string {
        return `Time: ${moment().utc().format("DD-MM-YYYY HH:mm:ss ZZ")}.`;
    }

    protected getUserInfoMessage(event): string {
        return `User: ${event.requestContext.authorizer.userId}.`;
    }

    protected abstract async getLogStreamName(): Promise<string>
}