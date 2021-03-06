// @flow
//
// Copyright 2019 Ivan Sorokin.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { Component, Fragment } from 'react'
import { FlatList, Alert, Linking } from 'react-native'
import { connect } from 'react-redux'

import SettingsListItem, { type Props as SettingsItem } from 'components/SettingsListItem'
import { type State as ReduxState, type Error, type Navigation } from 'common/types'
import colors from 'common/colors'
import { type State as SettingsState, BIOMETRY_STATUS } from 'modules/settings'
import { getBiometryTitle } from 'common'

type Props = {
  setCheckNodeApiHttpAddr: (checkNodeApiHttpAddr: string) => void,
  setChain: (chain: string) => void,
  getPhrase: () => void,
  destroyWallet: () => void,
  repairWallet: () => void,
  migrateToMainnet: () => void,
  settings: SettingsState,
  error: Error,
  isCreated: boolean,
  navigation: Navigation,
  isFloonet: boolean,
  enableBiometry: () => void,
  disableBiometry: () => void,
}
type State = {
  inputValue: string,
  amount: number,
  valid: boolean,
}

class Settings extends Component<Props, State> {
  static navigationOptions = {
    title: 'Settings',
  }

  state = {}

  componentDidMount() {
    // this.props.setCheckNodeApiHttpAddr('http://floonode.cycle42.com:13413')
    // this.props.setChain('floonet')
  }

  componentDidUpdate(prevProps) {}

  _onMigrateToMainnet = () => {
    return Alert.alert('Switch to Mainnet', 'This would destroy your floonet wallet!', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Switch',
        style: 'destructive',
        onPress: () => {
          this.props.migrateToMainnet()
        },
      },
    ])
  }
  _onDestroyWallet = () => {
    return Alert.alert(
      'Destroy this wallet',
      'This action would remove all of your data! Please back up your recovery phrase before!',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Destroy',
          style: 'destructive',
          onPress: () => {
            this.props.destroyWallet()
          },
        },
      ]
    )
  }
  _onGrinNode = () => {
    this.props.navigation.navigate('SettingsGrinNode')
  }
  _onRepairWallet = () => {
    return Alert.alert(
      'Repair this wallet',
      "This action would check a wallet's outputs against a live node, repair and restore missing outputs if required",
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Continue',
          style: 'default',
          onPress: () => {
            this.props.navigation.navigate('WalletRepair')
          },
        },
      ]
    )
  }

  render() {
    const { settings, navigation, getPhrase, isFloonet } = this.props
    const listData = [
      // { key: 'currency', title: 'Currency', value: 'EUR', onPress: () => {} },
      {
        key: 'grin_node',
        title: 'Grin node',
        onPress: this._onGrinNode,
      },
      {
        key: 'paperkey',
        title: 'Paper key',
        onPress: () => {
          getPhrase()
          navigation.navigate('ViewPaperKey')
        },
      },
      {
        key: 'legal_disclaimer',
        title: 'Legal disclaimer',
        onPress: () => {
          navigation.navigate('SettingsLegalDisclaimer')
        },
      },

      {
        key: 'feedback',
        title: 'Got feeback?',
        hideChevron: true,
        onPress: () => {
          Linking.openURL('mailto:ironbelly@cycle42.com')
        },
      },
      {
        key: 'repair',
        title: 'Repair this wallet',
        onPress: this._onRepairWallet,
        hideChevron: true,
      },
      {
        key: 'destroy',
        title: 'Destroy this wallet',
        titleStyle: {
          color: colors.warning,
        },
        hideChevron: true,
        onPress: () => this._onDestroyWallet(),
      },
    ]
    if (settings.biometryType) {
      listData.splice(0, 0, {
        key: 'biometryEnabled',
        title: getBiometryTitle(settings.biometryType),
        hideChevron: true,
        value: settings.biometryStatus === BIOMETRY_STATUS.enabled,
        onValueChange: (value: boolean) => {
          if (value) {
            this.props.enableBiometry()
          } else {
            this.props.disableBiometry()
          }
        },
      })
    }
    if (isFloonet) {
      listData.splice(0, 0, {
        key: 'chain',
        title: 'Switch to Mainnet',
        hideChevron: true,
        onPress: () => this._onMigrateToMainnet(),
        titleStyle: {
          color: colors.success,
          fontWeight: '600',
        },
      })
    }
    return (
      <Fragment>
        <FlatList
          style={{ paddingLeft: 16 }}
          data={listData}
          renderItem={({ item }: { item: SettingsItem }) => <SettingsListItem {...item} />}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = (state: ReduxState) => ({
  settings: state.settings,
  isCreated: state.tx.txCreate.created,
  error: state.tx.txCreate.error,
  isFloonet: state.settings.chain === 'floonet',
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setCheckNodeApiHttpAddr: (checkNodeApiHttpAddr: string) => {
    dispatch({ type: 'SET_SETTINGS', newSettings: { checkNodeApiHttpAddr } })
  },
  setChain: (chain: string) => {
    dispatch({ type: 'SET_SETTINGS', newSettings: { chain } })
  },
  getPhrase: () => {
    dispatch({ type: 'WALLET_PHRASE_REQUEST' })
  },
  destroyWallet: () => {
    dispatch({ type: 'WALLET_DESTROY_REQUEST' })
  },
  migrateToMainnet: () => {
    dispatch({ type: 'WALLET_MIGRATE_TO_MAINNET_REQUEST' })
  },
  enableBiometry: () => {
    dispatch({ type: 'ENABLE_BIOMETRY_REQUEST' })
  },
  disableBiometry: () => {
    dispatch({ type: 'DISABLE_BIOMETRY_REQUEST' })
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
