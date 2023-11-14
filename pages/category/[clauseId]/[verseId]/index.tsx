import React, { FC } from 'react';
import { Title } from '../../../../components/Title';
import { Page } from '../../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';

// interface pageProps {
//     params: {
//         clauseId: string
//     }
// }

// interface VerseProps {
//     clauseId: string
// }

const Verse: FC = () => {

    return (
        <div>
            <div className="text-3xl font-semibold mb-5">
                Ayat
            </div>
            <p>
                Ayat ayat
            </p>
        </div>
    );
};

const VersePage: Page = () => {
    return (
        <div>
            <Title>Ayat</Title>
            <Verse></Verse>
        </div>
    );
}

VersePage.layout = WithCategoryLayout;
export default VersePage;
