import { NodeType } from '../types/componentsInputs';
export default function ItemActions({ node, searchSimilarClusters, splitPhrase, mergeClusters, translationEnabled, }: {
    node: {
        type: NodeType;
        id: string;
        text: string;
    } | null;
    searchSimilarClusters?: (text: string, controller: AbortController) => Promise<{
        id: string;
        text: string;
        translation: string | null | undefined;
    }[]>;
    splitPhrase?: (phraseId: string, controller: AbortController) => Promise<{
        status: 'Success' | 'error';
        message: string;
    }>;
    mergeClusters?: (source: string[], destination: string, controller: AbortController) => Promise<{
        status: 'Success' | 'error';
        message: string;
    }>;
    translationEnabled: boolean;
}): JSX.Element;
