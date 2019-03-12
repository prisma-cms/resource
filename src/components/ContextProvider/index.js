
import React, {
  Component,
} from 'react';

import Context from '@prisma-cms/context';


class ContextProvider extends Component {

  static contextType = Context;


  // componentWillMount() {

  //   const {
  //     query,
  //     ...other
  //   } = this.context;

  //   this.newContext = {
  //     query: {
  //       ...query,
  //       ...this.prepareQuery(),
  //     },
  //     ...other
  //   }

  // }


  render() {

    const {
      children,
    } = this.props;

    let {
      query,
    } = this.context;

    Object.assign(this.context, {
      query: {
        ...query,
        ...this.prepareQuery(),
      },
    });

    return <Context.Provider
      value={this.context}
    >
      {children || null}
    </Context.Provider>;

  }


  prepareQuery(){

    return {
      ...this.prepareResourceQuery(),
    }
  }


  prepareResourceQuery() {


    const {
      queryFragments,
    } = this.context;


    const {
      ResourceNoNestingFragment,
      UserNoNestingFragment,
    } = queryFragments;
    
    
    const ResourceFragment = `
      fragment Resource on Resource {
        ...ResourceNoNesting
        CreatedBy {
          ...UserNoNesting
        }
      }

      ${ResourceNoNestingFragment}
      ${UserNoNestingFragment}
    `;


    const resourcesConnection = `
      query resourcesConnection (
        $where: ResourceWhereInput
        $orderBy: ResourceOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objectsConnection: resourcesConnection (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          aggregate{
            count
          }
          edges{
            node{
              ...Resource
            }
          }
        }
      }

      ${ResourceFragment}
    `;


    const resources = `
      query resources (
        $where: ResourceWhereInput
        $orderBy: ResourceOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objects: resources (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          ...Resource
        }
      }

      ${ResourceFragment}
    `;


    const resource = `
      query resource (
        $where: ResourceWhereUniqueInput!
      ){
        object: resource (
          where: $where
        ){
          ...Resource
        }
      }

      ${ResourceFragment}
    `;


    const createResourceProcessor = `
      mutation createResourceProcessor(
        $data: ResourceCreateInput!
      ) {
        response: createResourceProcessor(
          data: $data
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...Resource
          }
        }
      }

      ${ResourceFragment}
    `;


    const updateResourceProcessor = `
      mutation updateResourceProcessor(
        $data: ResourceUpdateInput!
        $where: ResourceWhereUniqueInput!
      ) {
        response: updateResourceProcessor(
          data: $data
          where: $where
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...Resource
          }
        }
      }

      ${ResourceFragment}
    `;



    return {
      resourcesConnection,
      resources,
      resource,
      createResourceProcessor,
      updateResourceProcessor,
    }

  }

}

export default ContextProvider;