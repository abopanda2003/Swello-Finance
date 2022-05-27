import { useEthers } from '@usedapp/core';
import { useEffect } from 'react';
import { useAppDispatch } from '../hooks';
import { useOwnedBattleflyTokenIds } from '../hooks/contracts/useBattleflyGameContract';
import { useStakingBattlefliesOfOwner } from '../hooks/contracts/useRevealStakingContract';
import { setAllHoldingTokenIds } from '../redux/holding';
import { setAllStakingTokenIds } from '../redux/staking';

const useInitAppConfig = () => {
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const { stakedTokenIds } = useStakingBattlefliesOfOwner(account);
  const { ownedTokenIds } = useOwnedBattleflyTokenIds(account);
  useEffect(() => {
    if (stakedTokenIds.length > 0) {
      dispatch(setAllStakingTokenIds(stakedTokenIds));
    }
  }, [account, dispatch, stakedTokenIds]);

  useEffect(() => {
    if (ownedTokenIds.length > 0) {
      dispatch(setAllHoldingTokenIds(ownedTokenIds));
    }
  }, [account, dispatch, ownedTokenIds]);
};

export default useInitAppConfig;
