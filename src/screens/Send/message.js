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

import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import { Text } from 'components/CustomFont'
import FormTextInput from 'components/FormTextInput'
import { type State as ReduxState, type Currency, type Error, type Navigation } from 'common/types'
import { type TxForm } from 'modules/tx'
import ChevronLeftImg from 'assets/images/ChevronLeft.png'
import { store } from 'common/redux'
import { type MoveFunc } from 'components/ScreenWithManySteps'
import { FlexGrow, Title } from 'common'

type Props = {
  setMessage: (message: string) => void,
  settings: {
    currency: Currency,
  },
  isCreated: boolean,
  navigation: Navigation,
  txForm: TxForm,
}

type State = {}

class Send extends Component<Props, State> {
  static navigationOptions = {
    header: null,
  }

  static backButtonText = 'Back'
  static backButtonIcon = ChevronLeftImg
  static nextButtonText = 'Next'
  static nextButtonDisabled = () => {
    return false
  }
  static nextButtonClick = (move: MoveFunc) => {
    return () => {
      move(1)
    }
  }

  state = {}

  render() {
    const { setMessage, txForm } = this.props

    return (
      <View>
        <Title>Message</Title>
        <View>
          <FormTextInput
            autoFocus={true}
            onChange={setMessage}
            value={txForm.message}
            placeholder="Optional"
          />
        </View>
        <FlexGrow />
      </View>
    )
  }
}

const mapStateToProps = (state: ReduxState) => ({
  txForm: state.tx.txForm,
  settings: state.settings,
  isCreated: state.tx.txCreate.created,
  error: state.tx.txCreate.error,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setMessage: (message: string) => {
    dispatch({ type: 'TX_FORM_SET_MESSAGE', message })
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Send)
