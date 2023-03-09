import { OneAIDataNode } from '../types/componentsInputs';
import { Trend } from '../types/modals';
export declare const COLLECTION_TYPE = "Collection";
export declare function getNodeText(node: OneAIDataNode): string;
export declare function getNodeId(node: OneAIDataNode): string;
export declare function getNodeItemsCount(node: OneAIDataNode): number;
export declare function getNodeDetails(node: OneAIDataNode | undefined, collection: string): {
    id: string;
    type: string;
};
export declare function getNodeTrends(node: OneAIDataNode | undefined): Trend[];
export declare const getNodeOriginalAndTranslatedText: (node: OneAIDataNode | undefined) => {
    originalText: string | null | undefined;
    translatedText: string | null | undefined;
};
