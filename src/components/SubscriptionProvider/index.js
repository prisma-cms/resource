
import React, { Component } from 'react'

import gql from "graphql-tag";

import Context from '@prisma-cms/context';

export default class SubscriptionProvider extends Component {


  static contextType = Context;


  state = {
    subscriptions: [],
  }


  componentDidMount() {

    this.subscribe();

  }

  componentWillUnmount() {

    this.unsubscribe();

  }


  async subscribe() {

    const {
      client,
    } = this.context;


    if (!client) {
      console.error("client is empty");
      return;
    }

    await this.unsubscribe();


    let {
      subscriptions,
    } = this.state;


    const subscribeResource = gql`
      subscription resource{
        resource{
          mutation
          node{
            id
          }
        }
      }
    `;

    const resourceSub = await client
      .subscribe({
        query: subscribeResource,
        variables: {
        },
      })
      .subscribe({
        next: async (data) => {

          await this.reloadData();

        },
        error(error) {
          console.error('subscribeCalls callback with error: ', error)
        },
      });


    subscriptions.push(resourceSub);

    this.setState({
      subscriptions,
    });

  }


  unsubscribe() {


    return new Promise((resolve) => {

      const {
        subscriptions,
      } = this.state;

      if (subscriptions && subscriptions.length) {


        subscriptions.map(n => {
          n.unsubscribe();
          return null;
        });

        Object.assign(this.state, {
          subscriptions: [],
        });

      }

      resolve();

    });

  }


  async reloadData() {

    const {
      client,
      // loadApiData,
    } = this.context;

    // await loadApiData();

    // await client.reFetchObservableQueries();


    if (!client.queryManager.fetchQueryRejectFns.size) {

      // console.log("client", client);

      return await client.resetStore()
        .catch(error => {
          console.error(error);
        });

    }

  }


  render() {

    const {
      children,
      resource,
      client,
      loadApiData,
      ...other
    } = this.props;

    return children ? <children.type
      {...children.props}
      {...other}
    /> : null;

  }

}