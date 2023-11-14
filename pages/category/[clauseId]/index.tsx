import React, { FC } from 'react';
import { Title } from '../../../components/Title';
import { Page } from '../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';

// interface pageProps {
//     params: {
//         clauseId: string
//     }
// }

// interface ClauseProps {
//     clauseId: string
// }

const Clause: FC = () => {

    return (
        <div>
            <div className="text-3xl font-semibold mb-5">
                Persetujuan Data Pribadi
            </div>
            <p>
                Persetujuan pemrosesan Data Pribadi dilakukan melalui persetujuan tertulis atau terekam.
            </p>
        </div>
    );
};

const ClausePage: Page = () => {
    return (
        <div>
            <Title>Pasal</Title>
            <Clause></Clause>
        </div>
    );
}

ClausePage.layout = WithCategoryLayout;
export default ClausePage;
