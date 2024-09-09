import {useFocusEffect} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {ActivityIndicator} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import * as Illustrations from '@components/Icon/Illustrations';
import useLocalize from '@hooks/useLocalize';
import usePolicy from '@hooks/usePolicy';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
import type {FullScreenNavigatorParamList} from '@libs/Navigation/types';
import AccessOrNotFoundWrapper from '@pages/workspace/AccessOrNotFoundWrapper';
import WorkspacePageWithSections from '@pages/workspace/WorkspacePageWithSections';
import * as Policy from '@userActions/Policy/Policy';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type SCREENS from '@src/SCREENS';
import type {WorkspaceCardsList} from '@src/types/onyx';
import WorkspaceCompanyCardPageEmptyState from './WorkspaceCompanyCardPageEmptyState';
import WorkspaceCompanyCardsFeedAddedEmptyPage from './WorkspaceCompanyCardsFeedAddedEmptyPage';
import WorkspaceCompanyCardsFeedNoFeedPendingPage from './WorkspaceCompanyCardsFeedNoFeedPendingPage';
import WorkspaceCompanyCardsList from './WorkspaceCompanyCardsList';
import WorkspaceCompanyCardsListHeaderButtons from './WorkspaceCompanyCardsListHeaderButtons';

const mockedCards = {
    id1: {
        accountID: 885646,
        nameValuePairs: {
            cardTitle: 'Test 1',
        },
        cardNumber: '1234 56XX XXXX 1222',
    },
    id2: {
        accountID: 885646,
        nameValuePairs: {
            cardTitle: 'Test 2',
        },
        cardNumber: '1234 56XX XXXX 1222',
    },
    id18: {
        accountID: 885646,
        nameValuePairs: {
            cardTitle: 'Test 1',
        },
        cardNumber: '1234 56XX XXXX 1222',
    },
    id27: {
        accountID: 885646,
        nameValuePairs: {
            cardTitle: 'Test 2',
        },
        cardNumber: '1234 56XX XXXX 1222',
    },
    id16: {
        accountID: 885646,
        nameValuePairs: {
            cardTitle: 'Test 1',
        },
        cardNumber: '1234 56XX XXXX 1222',
    },
    id25: {
        accountID: 885646,
        nameValuePairs: {
            cardTitle: 'Test 2',
        },
        cardNumber: '1234 56XX XXXX 1222',
    },
    id14: {
        accountID: 885646,
        nameValuePairs: {
            cardTitle: 'Test 1',
        },
        cardNumber: '1234 56XX XXXX 1222',
    },
    id23: {
        accountID: 885646,
        nameValuePairs: {
            cardTitle: 'Test 2',
        },
        cardNumber: '1234 56XX XXXX 1222',
    },
    id12: {
        accountID: 885646,
        nameValuePairs: {
            cardTitle: 'Test 1',
        },
        cardNumber: '1234 56XX XXXX 1222',
    },
    id21: {
        accountID: 885646,
        nameValuePairs: {
            cardTitle: 'Test 2',
        },
        cardNumber: '1234 56XX XXXX 1222',
    },
} as unknown as WorkspaceCardsList;

type WorkspaceCompanyCardPageProps = StackScreenProps<FullScreenNavigatorParamList, typeof SCREENS.WORKSPACE.COMPANY_CARDS>;

function WorkspaceCompanyCardPage({route}: WorkspaceCompanyCardPageProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const theme = useTheme();
    const policyID = route.params.policyID;
    const policy = usePolicy(policyID);
    const workspaceAccountID = policy?.workspaceAccountID ?? -1;
    const [cardFeeds] = useOnyx(`${ONYXKEYS.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${workspaceAccountID.toString()}`);
    const fetchCompanyCards = useCallback(() => {
        Policy.openPolicyCompanyCardsPage(policyID, workspaceAccountID);
    }, [policyID, workspaceAccountID]);

    useFocusEffect(fetchCompanyCards);

    const companyCards = cardFeeds?.companyCards;
    const companyCardsLength = Object.keys(companyCards ?? {}).length;
    const isNoFeed = companyCardsLength === 0;
    const isFeedAdded = companyCardsLength > 0 && !Object.values(companyCards ?? {})[0].pending;
    const isPending = companyCardsLength === 1 && Object.values(companyCards ?? {})[0].pending;
    const isLoading = !cardFeeds || cardFeeds.isLoading;
    const [lastSelectedFeed] = useOnyx(`${ONYXKEYS.COLLECTION.LAST_SELECTED_FEED}${policyID}`);
    const defaultFeed = Object.keys(cardFeeds?.companyCards ?? {})[0];
    const selectedFeed = lastSelectedFeed ?? defaultFeed;

    // TODO: use data form onyx instead of mocked one when API is implemented
    // const [cardsList] = useOnyx(`${ONYXKEYS.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${selectedFeed}`);
    const cardsList = mockedCards ?? {};

    return (
        <AccessOrNotFoundWrapper
            policyID={route.params.policyID}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED}
        >
            {isLoading && (
                <ActivityIndicator
                    size={CONST.ACTIVITY_INDICATOR_SIZE.LARGE}
                    style={styles.flex1}
                    color={theme.spinner}
                />
            )}
            <WorkspacePageWithSections
                shouldUseScrollView={!isFeedAdded}
                icon={Illustrations.CompanyCard}
                headerText={translate('workspace.common.companyCards')}
                route={route}
                guidesCallTaskID={CONST.GUIDES_CALL_TASK_IDS.WORKSPACE_COMPANY_CARDS}
                shouldShowOfflineIndicatorInWideScreen
                includeSafeAreaPaddingBottom
                showLoadingAsFirstRender={false}
            >
                {isFeedAdded && (
                    <WorkspaceCompanyCardsListHeaderButtons
                        policyID={policyID}
                        selectedFeed={selectedFeed}
                    />
                )}
                {isNoFeed && !isLoading && <WorkspaceCompanyCardPageEmptyState route={route} />}
                {isFeedAdded && !isLoading && <WorkspaceCompanyCardsFeedAddedEmptyPage />}
                {isPending && !isLoading && <WorkspaceCompanyCardsFeedNoFeedPendingPage />}
                {isFeedAdded && <WorkspaceCompanyCardsList cardsList={cardsList} />}
            </WorkspacePageWithSections>
        </AccessOrNotFoundWrapper>
    );
}

WorkspaceCompanyCardPage.displayName = 'WorkspaceCompanyCardPage';

export default WorkspaceCompanyCardPage;
