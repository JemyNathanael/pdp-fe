import React from 'react';
import { Title } from '../../../components/Title';
import { Page } from '../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Authorize } from '@/components/Authorize';

// interface pageProps {
//     params: {
//         clauseId: string
//     }
// }

// interface ClauseProps {
//     clauseId: string
// }

const Clause: React.FC = () => {

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
        <Authorize>
            <Title>Pasal</Title>
            <Clause></Clause>
        </Authorize>
    );
}

ClausePage.layout = WithCategoryLayout;
export default ClausePage;
