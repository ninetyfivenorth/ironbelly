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
import { Button, Text } from 'components/CustomFont'
import styled from 'styled-components'
import { FlexGrow, hrGrin, LoaderView } from 'common'
import colors from 'common/colors'
import { connect } from 'react-redux'
import { type State as ReduxState, type Tx } from 'common/types'
import { ActivityIndicator } from 'react-native'

const Wrapper = styled.View`
  background: white;
  min-height: 280px;
  border-radius: 8;
  margin: 16px 8px;
`

const Header = styled.View`
  background: black;
  border-top-right-radius: 8;
  border-top-left-radius: 8;
  height: 56px;
  justify-content: center;
`

const HeaderText = styled(Text)`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: ${colors.primary};
`

const Body = styled.View`
  padding: 8px;
  flex: 1;
`

const AmountText = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 8px 0;
`

const FeeText = styled(Text)`
  font-size: 16px;
  text-align: center;
`
const SuccessText = styled(Text)`
  font-size: 24;
  font-weight: bold;
  text-align: center;
`

const Success = styled.View`
  flex: 1;
  justify-content: center;
`

type Props = {
  amount: number,
  dest: string,
  txSlateId: string,
  txGet: (txSlateId: string) => void,
  txPost: (txSlateId: string) => void,
  close: () => void,
  tx: Tx,
  inProgress: boolean,
  posted: boolean,
}
type State = {}

class TxPostConfirmationModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    props.txGet(props.txSlateId)
  }

  render() {
    const { tx, close, txSlateId, txPost, inProgress, posted } = this.props
    return (
      <Wrapper>
        {(inProgress && (
          <LoaderView>
            <ActivityIndicator size="large" color={colors.primary} />
          </LoaderView>
        )) || (
          <React.Fragment>
            <Header>
              <HeaderText>Confirm transaction</HeaderText>
            </Header>
            {(posted && (
              <Success>
                <SuccessText>Transaction have been posted successfully!</SuccessText>
              </Success>
            )) || (
              <Body>
                <AmountText>Send {hrGrin(-tx.amount)} </AmountText>
                <FeeText>Fee: {hrGrin(tx.fee)} </FeeText>
                <FlexGrow />
                <Button
                  style={{ marginBottom: 8 }}
                  title="Confirm"
                  onPress={() => txPost(txSlateId)}
                />
                <Button inverted title="Decline" onPress={() => close()} />
              </Body>
            )}
          </React.Fragment>
        )}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: ReduxState) => ({
  txSlateId: state.tx.txPost.txSlateId,
  tx: state.tx.txGet.data || {},
  inProgress: state.tx.txGet.inProgress || state.tx.txPost.inProgress,
  posted: state.tx.txPost.posted,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  txGet: txSlateId => {
    dispatch({ type: 'TX_GET_REQUEST', txSlateId })
  },
  txPost: txSlateId => {
    dispatch({ type: 'TX_POST_REQUEST', txSlateId })
  },
  close: () => {
    dispatch({ type: 'TX_POST_CLOSE' })
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TxPostConfirmationModal)
