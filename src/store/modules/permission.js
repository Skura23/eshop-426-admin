// store/permission.js
import {
  asyncRouterMap,
  constantRouterMap
} from '@/router';
import _ from "lodash";
import deepdash from "deepdash";
deepdash(_)

// function hasPermission(roles, route) {
//   if (route.meta && route.meta.role) {
//     return roles.some(role => route.meta.role.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

// 用来手动给路由加id
// let num = 1

// function iterateRouterMap(arr) {
//   for (let i = 0; i < arr.length; i++) {
//     let elem = arr[i];
//     elem.id = num
//     num++
//     if (elem.children) {
//       for (let i2 = 0; i2 < elem.children.length; i2++) {
//         let elem2 = elem.children[i2];
//         elem2.id = num
//         num++
//         iterateRouterMap(elem2, i)
//       }
//     }
//   }
// }
// iterateRouterMap(asyncRouterMap)
// console.log(asyncRouterMap, 'asyncRouterMap');




const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    hasRole: false
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.hasRole = true
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      let idArr = []

      function getRouteIdArr(arr) {
        for (let i = 0; i < arr.length; i++) {
          let elem = arr[i];
          idArr.push(elem.rule_id)
          if (elem.child) {
            getRouteIdArr(elem.child)
          }
        }
      }
      return new Promise(resolve => {
        let menuList = JSON.parse(data || '[]')

        getRouteIdArr(menuList)

        console.log(menuList, idArr, 'idArr');
        let accessedRouters = []

        // 非迭代方法处理, 最多三层
        // let arr1 = []
        // arr1 = asyncRouterMap.filter((v, i) => {
        //   if (idArr.indexOf('' + v.id) >= 0) {
        //     return true;
        //   } else {
        //     return false
        //   }
        // })
        // for (let i = 0; i < arr1.length; i++) {
        //   let elem = arr1[i];
        //   if (elem.children) {
        //     elem.children = elem.children.filter((v, i) => {
        //       if (idArr.indexOf('' + v.id) >= 0) {
        //         return true;
        //       } else {
        //         return false
        //       }
        //     })

        //     for (let i2 = 0; i2 < arr1[i].children.length; i2++) {
        //       let elem2 = arr1[i].children[i2];
        //       if (elem2.children) {
        //         elem2.children = elem2.children.filter((v, i) => {
        //           if (idArr.indexOf('' + v.id) >= 0) {
        //             return true;
        //           } else {
        //             return false
        //           }
        //         })
        //       }
        //     }
        //   }
        // }

        // accessedRouters = arr1

        // function getaccessedRouters(arr) {
        //   // for (let i = 0; i < arr.length; i++) {
        //   //   let elem = arr[i];

        //   //   if (idArr.indexOf(elem.id)) {
        //   //     accessedRouters.push(elem)
        //   //   }
        //   //   if (elem.children) {
        //   //     for (let i2 = 0; i2 < elem.children.length; i2++) {
        //   //       let elem2 = elem.children[i2];
        //   //       if (idArr.indexOf(elem2.id)) {
        //   //         accessedRouters.push(elem2)
        //   //       }
        //   //       getaccessedRouters(elem2, i)
        //   //     }
        //   //   }
        //   // }
        //   let aimarr = []
        //   aimarr = arr.filter((v, i) => {
        //     if (idArr.indexOf(''+v.id) >= 0) {
        //       return true;
        //     } else {
        //       return false
        //     }
        //   })
        //   for (let i = 0; i < aimarr.length; i++) {
        //     let elem = aimarr[i];
        //     if (elem.children) {
        //       let aimarr2 = []
        //       aimarr2 = getaccessedRouters(elem.children)
        //       elem.children = aimarr2
        //     }
        //   }

        //   return aimarr
        // }

        // 根据值数组筛选出对象数组
        function filter(array, fn) {
          return array.reduce((r, o) => {
            var children = filter(o.children || [], fn);
            if (fn(o) || children.length) r.push(Object.assign({}, o, children.length && {
              children
            }));
            return r;
          }, []);
        }
        accessedRouters = filter(asyncRouterMap, ({
          id
        }) => idArr.indexOf('' + id) >= 0);

        // accessedRouters = _.filterDeep(asyncRouterMap, (value, key, parent) => {
        //   if (key == 'id' && idArr.indexOf(''+value) >= 0) return true;
        // })

        // accessedRouters = getaccessedRouters(asyncRouterMap)

        // const accessedRouters = asyncRouterMap.filter(v => {
        //   if (roles.indexOf('admin') >= 0) return true;
        //   if (hasPermission(roles, v)) {
        //     if (v.children && v.children.length > 0) {
        //       v.children = v.children.filter(child => {
        //         if (hasPermission(roles, child)) {
        //           return child
        //         }
        //         return false;
        //       });
        //       return v
        //     } else {
        //       return v
        //     }
        //   }
        //   return false;
        // });
        console.log(accessedRouters, 'accessedRouters');
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;