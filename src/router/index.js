import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import store from '@/store'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouterMap = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },



  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'dashboard'
      }
    }]
  },
  // 404 page must be placed at the end !!!




]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router


//异步挂载的路由
//动态需要根据权限加载的路由表 
export const asyncRouterMap = [{
    path: '/shop-manage',
    component: Layout,
    redirect: '/shop-manage/shop-list',
    name: 'shop-manage',
    alwaysShow: true,
    id: 1,
    meta: {
      title: '门店管理',
      icon: 'example'
    },
    children: [{
      path: 'shop-list',
      id: 2,
      component: () => import('@/views/shop-manage/shop-list'),
      name: 'shop-list',
      meta: {
        title: '门店列表'
      }
    }, {
      path: 'wechatshop-list',
      id: 3,
      component: () => import('@/views/shop-manage/wechatshop-list'),
      name: 'wechatshop-list',
      meta: {
        title: '微信商户'
      }
    }, {
      path: 'wechatshop-add',
      component: () => import('@/views/shop-manage/wechatshop-add'),
      name: 'wechatshop-add',
      hidden: true,
      id: 3,
      meta: {
        title: '微信商户申请'
      }
    }, {
      path: 'wechatmenu',
      component: () => import('@/views/shop-manage/wechatmenu'),
      name: 'wechatmenu',
      id: 37,
      meta: {
        title: '微信菜单'
      }
    }],

  },
  {
    path: '/clients-manage',
    component: Layout,
    redirect: '/clients-manage/clients-list',
    name: 'clients-manage',
    alwaysShow: true,
    id: 4,
    meta: {
      title: '客户管理',
      icon: 'nested'
    },
    children: [{
        id: 5,
        path: 'clients-list',
        component: () => import('@/views/clients-manage/clients-list'),
        name: 'clients-list',
        meta: {
          title: '客户列表'
        }
      },
      {
        id: 5,
        path: 'clients-detail',
        component: () => import('@/views/clients-manage/detail'),
        name: 'clients-detail',
        hidden:true,
        meta: {
          title: '客户详情'
        }
      },
    ]
  },
  {
    path: '/staff-manage',
    component: Layout,
    redirect: '/staff-manage/staff-list',
    name: 'staff-manage',
    id: 6,
    alwaysShow: true,
    meta: {
      title: '员工管理',
      icon: 'peoples'
    },
    children: [{
        id: 7,
        path: 'staff-list',
        component: () => import('@/views/staff-manage/staff-list'),
        name: 'staff-list',
        meta: {
          title: '员工列表'
        }
      },
      {
        id: 8,
        path: 'post-list',
        component: () => import('@/views/staff-manage/post-list'),
        name: 'post-list',
        meta: {
          title: '岗位列表'
        }
      },
    ]
  },
  {
    path: '/goods-manage',
    component: Layout,
    redirect: '/goods-manage/selfrun-manage/list',
    name: 'goods-manage',
    alwaysShow: true,
    id: 9,
    meta: {
      title: '商品管理',
      icon: 'shopping'
    },
    children: [{
        path: 'selfrun-manage',
        redirect: '/goods-manage/selfrun-manage/list',
        component: () => import('@/views/goods-manage/selfrun-manage/index'),
        id: 10,
        name: 'selfrun-manage',
        meta: {
          title: '自营商品库'
        },
        children: [{
            path: 'goods-add',
            component: () => import('@/views/goods-manage/selfrun-manage/goods-add'),
            name: 'goods-add',
            id: 12,
            meta: {
              title: '自营新增',
              type: 'store'
            },
          },
          {
            path: 'goods-edit',
            hidden: true,
            component: () => import('@/views/goods-manage/selfrun-manage/goods-add'),
            name: 'goods-edit',
            id: 39,
            meta: {
              title: '自营编辑',
              type: 'store'
            },
          },
          // {
          //   path: 'goods-cates',
          //   id:13,
          //   component: () => import('@/views/goods-manage/goods-cates'),
          //   name: 'goods-cates',
          //   meta: {
          //     title: '商品分类',
          //     type: 'store'
          //   },
          // },
          {
            path: 'list',
            component: () => import('@/views/goods-manage/list'),
            name: 'list',
            id: 13,
            meta: {
              title: '商品列表',
              type: 'store'
            },

          },
          {
            path: 'banchuan',
            component: () => import('@/views/goods-manage/list'),
            name: 'banchuan',
            id: 14,
            meta: {
              title: '板川商品',
              type: 'store_banchuan'
            },

          },
        ]
      },
      {
        path: 'banchuan-manage',
        redirect: '/goods-manage/selfrun-manage/list',
        component: () => import('@/views/goods-manage/selfrun-manage/index'),
        name: 'selfrun-manage',
        id: 11,
        meta: {
          title: '板川商品库'
        },
        children: [{
            path: 'goods-add',
            component: () => import('@/views/goods-manage/banchuan-manage/goods-add'),
            name: 'goods-add',
            id: 15,
            meta: {
              title: '板川新增',
              type: 'basic'
            },
          },
          {
            path: 'goods-edit',
            hidden: true,
            component: () => import('@/views/goods-manage/banchuan-manage/goods-add'),
            name: 'goods-edit',
            id: 40,
            meta: {
              title: '板川编辑',
              type: 'basic'
            },
          },
          {
            path: 'goods-cates',
            id: 16,
            component: () => import('@/views/goods-manage/goods-cates'),
            name: 'goods-cates',
            meta: {
              title: '板川分类',
              type: 'basic'
            },
          },
          {
            path: 'list',
            id: 17,
            component: () => import('@/views/goods-manage/list'),
            name: 'list',
            meta: {
              title: '商品列表',
              type: 'basic'
            },

          },
        ]
      },


      // {
      //   path: 'post-list',
      //   component: ()=>import('@/views/goods-manage/post-list'),
      //   name: 'post-list',
      //   meta: { title: '板川商品库' },
      //   children: [
      //     {
      //       path: 'goods-list',
      //       component: ()=>import('@/views/goods-manage/goods-list'),
      //       name: 'goods-list',
      //       meta: { title: '自营商品库' }
      //     },
      //     {
      //       path: 'post-list',
      //       component: ()=>import('@/views/goods-manage/post-list'),
      //       name: 'post-list',
      //       meta: { title: '板川商品库' }
      //     },
      //   ]
      // },
    ]
  },
  {
    path: '/service-staff',
    component: Layout,
    redirect: '/service-staff/list',
    name: 'service-staff',
    id: 18,
    meta: {
      title: '服务人员',
      icon: 'theme'
    },
    alwaysShow: true,
    children: [{
      path: 'list',
      name: 'list',
      id: 19,
      component: () => import('@/views/service-staff/list'),
      meta: {
        title: '人员列表'
      }
    }]
  }, {
    path: '/coupon-manage',
    component: Layout,
    redirect: '/coupon-manage/list',
    name: 'coupon-manage',
    id: 20,
    meta: {
      title: '优惠券管理',
      icon: 'star'
    },
    alwaysShow: true,
    children: [{
      path: 'list',
      name: 'list',
      id: 21,
      component: () => import('@/views/coupon-manage/list'),
      meta: {
        title: '优惠券列表'
      }
    }]
  },
  {
    path: '/credit-shop',
    component: Layout,
    redirect: '/credit-shop/list',
    name: 'credit-shop',
    id: 22,
    meta: {
      title: '积分商城',
      icon: 'icon'
    },
    alwaysShow: true,
    children: [{
        path: 'list',
        name: 'list',
        id: 23,
        component: () => import('@/views/credit-shop/list'),
        meta: {
          title: '积分商品'
        }
      },
      {
        path: 'goods-add',
        name: 'goods-add',
        id: 24,
        component: () => import('@/views/credit-shop/goods-add'),
        meta: {
          title: '新增商品'
        }
      },
      {
        path: 'goods-edit',
        name: 'goods-edit',
        hidden: true,
        id: 41,
        component: () => import('@/views/credit-shop/goods-add'),
        meta: {
          title: '编辑商品'
        }
      },
      {
        path: 'goods-cates',
        name: 'goods-cates',
        id: 25,
        component: () => import('@/views/credit-shop/goods-cates'),
        meta: {
          title: '商品分类'
        }
      }
    ]
  },
  {
    path: '/bargain-goods',
    component: Layout,
    redirect: '/bargain-goods/list',
    name: 'bargain-goods',
    id: 26,
    meta: {
      title: '砍价管理',
      icon: 'form'
    },
    alwaysShow: true,
    children: [{
        path: 'list',
        id: 27,
        name: 'bargain-list',
        component: () => import('@/views/bargain-goods/list'),
        meta: {
          title: '砍价商品'
        }
      },
      {
        path: 'goods-add',
        id: 28,
        name: 'bargain-goods-add',
        component: () => import('@/views/bargain-goods/goods-add'),
        meta: {
          title: '新增砍价商品'
        }
      },
      {
        path: 'goods-edit',
        name: 'bargain-goods-edit',
        id: 42,
        hidden: true,
        component: () => import('@/views/bargain-goods/goods-add'),
        meta: {
          title: '编辑商品'
        }
      },
      // {
      //   path: 'goods-cates',
      //   name: 'goods-cates',
      //   component: () => import('@/views/discount-goods/goods-cates'),
      //   meta: {
      //     title: '商品分类'
      //   }
      // }
    ]
  },
  {
    path: '/seckill-manage',
    component: Layout,
    redirect: '/seckill-manage/list',
    name: 'seckill-manage',
    id: 29,
    meta: {
      title: '秒杀管理',
      icon: 'form'
    },
    alwaysShow: true,
    children: [{
        path: 'list',
        name: 'seckill-list',
        id: 30,
        component: () => import('@/views/seckill-manage/list'),
        meta: {
          title: '活动列表'
        }
      },
      {
        path: 'goods-list',
        name: 'seckill-goods-list',
        hidden: true,
        id: 43,
        component: () => import('@/views/seckill-manage/goods-list'),
        meta: {
          title: '秒杀商品列表'
        }
      },
      {
        path: 'goods-edit',
        name: 'seckill-goods-edit',
        hidden: true,
        id: 44,
        component: () => import('@/views/seckill-manage/goods-add'),
        meta: {
          title: '秒杀商品编辑'
        }
      },
      {
        path: 'goods-add',
        name: 'seckill-goods-add',
        hidden: true,
        id: 45,
        component: () => import('@/views/seckill-manage/goods-add'),
        meta: {
          title: '秒杀商品新增'
        }
      },
      // {
      //   path: 'goods-cates',
      //   name: 'goods-cates',
      //   component: () => import('@/views/discount-goods/goods-cates'),
      //   meta: {
      //     title: '商品分类'
      //   }
      // }
    ]
  },
  // 案例管理
  {
    path: '/case-manage',
    component: Layout,
    redirect: '/case-manage/classlist',
    name: 'case-manage',
    id: 31,
    meta: {
      title: '案例管理',
      icon: 'star'
    },
    alwaysShow: true,
    children: [{
        path: 'classlist',
        name: 'classlist',
        id: 32,
        component: () => import('@/views/case-manage/classlist'),
        meta: {
          title: '案例分类'
        }
      },
      {
        path: 'comment-check',
        name: 'comment-check',
        id: 33,
        component: () => import('@/views/case-manage/comment-check'),
        meta: {
          title: '评论审核'
        }
      },

    ]
  },

  // 开店申请
  {
    path: '/shopapply-manage',
    component: Layout,
    redirect: '/shopapply-manage/record',
    name: 'shopapply-manage',
    id: 34,
    meta: {
      title: '开店申请',
      icon: 'star'
    },
    alwaysShow: true,
    children: [{
      path: 'record',
      name: 'shopapply-record',
      id: 35,
      component: () => import('@/views/shopapply-manage/record'),
      meta: {
        title: '开店申请记录'
      }
    }]
  },

  // 订单管理
  {
    path: '/order-manage',
    component: Layout,
    redirect: '/order-manage/list',
    name: 'order-manage',
    id: 36,
    meta: {
      title: '订单管理',
      icon: 'star'
    },
    alwaysShow: true,
    children: [{
      path: 'list',
      name: 'order-list',
      id: 37,
      component: () => import('@/views/order-manage/list'),
      meta: {
        title: '订单列表'
      }
    }, {
      path: 'detail',
      name: 'order-detail',
      id: '37',
      hidden: true,
      component: () => import('@/views/order-manage/detail'),
      meta: {
        title: '订单详情'
      }
    }]
  },
  // 财务
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/dailyMoney',
    name: 'finance',
    id: 36,
    meta: {
      title: '财务',
      icon: 'star'
    },
    alwaysShow: true,
    children: [{
      path: 'dailyMoney',
      name: 'finance-dailyMoney',
      id: 37,
      component: () => import('@/views/finance/dailyMoney'),
      meta: {
        title: '每日余额'
      }
    }, {
      path: 'wechatmenu',
      component: () => import('@/views/shop-manage/wechatmenu'),
      name: 'wechatmenu',
      meta: {
        title: '微信菜单'
      }
    }]
  },


  // 示例页面

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [{
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: {
  //         title: 'Menu1'
  //       },
  //       children: [{
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: {
  //             title: 'Menu1-1'
  //           }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: {
  //             title: 'Menu1-2'
  //           },
  //           children: [{
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: {
  //                 title: 'Menu1-2-1'
  //               }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: {
  //                 title: 'Menu1-2-2'
  //               }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: {
  //             title: 'Menu1-3'
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: {
  //         title: 'menu2'
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [{
  //     path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //     meta: {
  //       title: 'External Link',
  //       icon: 'link'
  //     }
  //   }]
  // },

  // 404 page must be placed at the end !!!
  // {
  //   path: '/404',
  //   component: () => import('@/views/404'),
  //   hidden: true
  // },
  // {
  //   path: '*',
  //   redirect: '/404',
  //   hidden: true
  // }
];