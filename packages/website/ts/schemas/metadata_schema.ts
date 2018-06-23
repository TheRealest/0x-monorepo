export const orderMetadataSchema = {
    id: '/OrderMetadata',
    properties: {
        makerToken: { $ref: '/PortalTokenMetadata' },
        takerToken: { $ref: '/PortalTokenMetadata' },
        message: { type: 'string' },
    },
    required: ['makerToken', 'takerToken', 'message'],
    type: 'object',
};
