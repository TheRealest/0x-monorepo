import { Web3Wrapper } from '@0xproject/web3-wrapper';
import * as _ from 'lodash';
import * as React from 'react';
//import * as htmlToImage from 'wkhtmltoimage';
import { AssetToken, Token, TokenByAddress } from 'ts/types';
import { configs } from 'ts/utils/configs';
import { utils } from 'ts/utils/utils';

const MESSAGE_IMAGE_BODY_STYLE = 'background: #ddd; margin: 0;';
const MESSAGE_IMAGE_DIV_STYLE = 'width: 250px; margin: 0px; padding: 30px 20px; box-sizing: border-box;';
const MESSAGE_IMAGE_IMG_STYLE = 'display: inline-block; width: 12px; height: 12px; margin: 0 2px;';

// Each of these functions performs one parsing transform on the message body e.g. bold text or token symbols
const MESSAGE_TRANSFORM_FUNCTIONS = [
    (message, context) => message.replace(/(\*\*)(.*?)\1/g, '<strong>$2</strong>')
    (message, context) => message.replace(/(_)(.*?)\1/g, '<em>$2</em>')
    (message, context) => message.replace(/<<MAKER_TOKEN_SYMBOL>>/g, context.makerTokenSymbol)
    (message, context) => message.replace(/<<MAKER_TOKEN_LOGO>>/g, context.makerTokenLogo)
    (message, context) => message.replace(/<<MAKER_TOKEN_AMOUNT>>/g, context.makerTokenAmount)
    (message, context) => message.replace(/<<TAKER_TOKEN_SYMBOL>>/g, context.takerTokenSymbol)
    (message, context) => message.replace(/<<TAKER_TOKEN_LOGO>>/g, context.takerTokenLogo)
    (message, context) => message.replace(/<<TAKER_TOKEN_AMOUNT>>/g, context.takerTokenAmount)
]

interface OrderMessageImageProps {
    orderMessage: string;
    makerAssetToken: AssetToken;
    takerAssetToken: AssetToken;
    makerToken: Token;
    takerToken: Token;
}

interface OrderMessageImageState {}

export class OrderMessageImage extends React.Component<OrderMessageImageProps, OrderMessageImageState> {
    public render(): React.ReactNode {
        const makerImage = this.props.makerToken.iconUrl;
        const takerImage = this.props.takerToken.iconUrl;

        const makerImageElement = `<img src="${this.props.makerToken.iconUrl}" style="${MESSAGE_IMAGE_IMG_STYLE}" />`;
        const takerImageElement = `<img src="${this.props.takerToken.iconUrl}" style="${MESSAGE_IMAGE_IMG_STYLE}" />`;

        const makerTokenAmount = this._normalizeAmount(this.props.makerAssetToken, this.props.makerToken);
        const takerTokenAmount = this._normalizeAmount(this.props.takerAssetToken, this.props.takerToken);

        const imageHtmlPrefix = `<body style="${MESSAGE_IMAGE_BODY_STYLE}"><div style="${MESSAGE_IMAGE_DIV_STYLE}">`;
        const imageHtmlSuffix = '</div></body>';

        const messageContext = {
          makerTokenSymbol: this.props.makerToken.symbol,
          makerTokenLogo: makerImageElement,
          makerTokenAmount: makerTokenAmount,
          takerTokenSymbol: this.props.takerToken.symbol,
          takerTokenLogo: takerImageElement,
          takerTokenAmount: takerTokenAmount,
        };
        const finalMessageHtml = MESSAGE_TRANSFORM_FUNCTIONS.reduce((message, transformFunction) => transformFunction(message, messageContext), this.props.orderMessage);

        return (
            <div>
                {finalMessageHtml}
            </div>
        );
    }
    private _normalizeAmount(assetToken: AssetToken, token: Token): string {
        const unitAmount = Web3Wrapper.toUnitAmount(assetToken.amount, token.decimals);
        return unitAmount.toNumber().toFixed(configs.AMOUNT_DISPLAY_PRECSION);
    }
}
