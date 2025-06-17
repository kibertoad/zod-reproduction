import {z} from "zod/v4";
import {ZodObject} from "zod/v4";
import {randomUUID} from "node:crypto";

const AMPLITUDE_BASE_MESSAGE_SCHEMA = z
    .object({
        event_type: z.literal<string>('<replace.me>'),
        event_properties: z.object({}),
        user_id: z.string().min(1).or(z.literal('SYSTEM')),
        groups: z.record(z.string(), z.any()).optional(),
    })
    .strip()

// here is the recommended change part
export type AmplitudeMessage = {
    schema: z.ZodObject<(typeof AMPLITUDE_BASE_MESSAGE_SCHEMA)["shape"], z.core.$strip>;
};

type AmplitudeMessageSchemaType<T extends AmplitudeMessage> = z.infer<T['schema']>

const testMessages: Record<'myEvent', AmplitudeMessage> = {
    myEvent: {
        schema: AMPLITUDE_BASE_MESSAGE_SCHEMA.extend({
            event_type: z.literal('my event'),
            event_properties: z.object({
                number: z.number(),
            }),
        }),
    },
}
const testMessagesValues = Object.values(testMessages)
type SupportedMessages = typeof testMessagesValues

export class AmplitudeAdapter<AmplitudeMessages extends AmplitudeMessage[]> {
    public track<Message extends AmplitudeMessages[number]>(
        supportedMessage: Message,
        data: Omit<AmplitudeMessageSchemaType<Message>, 'event_type'>,
    ) {
        const message = supportedMessage.schema.parse({
            event_type: supportedMessage.schema.shape.event_type.value,
            ...data,
        })
    }
}

const amplitudeAdapter: AmplitudeAdapter<SupportedMessages> = new AmplitudeAdapter()

amplitudeAdapter.track(testMessages.myEvent, {
    user_id: randomUUID(),
    event_properties: {
        number: 1,
    },
    // @ts-expect-error This field has invalid type, hence it is good that it's an error
    groups: 123,
})
