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
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
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
  {
    path: '/shop-manage',
    component: Layout,
    redirect: '/shop-manage/shop-list',
    name: 'shop-manage',
    alwaysShow: true,
    meta: {
      title: '门店管理',
      icon: 'example'
    },
    children: [{
      path: 'shop-list',
      component: () => import('@/views/shop-manage/shop-list'),
      name: 'shop-list',
      meta: {
        title: '门店列表'
      }
    }]
  },
  {
    path: '/clients-manage',
    component: Layout,
    redirect: '/clients-manage/clients-list',
    name: 'clients-manage',
    alwaysShow: true,
    meta: {
      title: '客户管理',
      icon: 'nested'
    },
    children: [{
      path: 'clients-list',
      component: () => import('@/views/clients-manage/clients-list'),
      name: 'clients-list',
      meta: {
        title: '客户列表'
      }
    }]
  },
  {
    path: '/staff-manage',
    component: Layout,
    redirect: '/staff-manage/staff-list',
    name: 'staff-manage',
    alwaysShow: true,
    meta: {
      title: '员工管理',
      icon: 'peoples'
    },
    children: [{
        path: 'staff-list',
        component: () => import('@/views/staff-manage/staff-list'),
        name: 'staff-list',
        meta: {
          title: '员工列表'
        }
      },
      {
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
    meta: {
      title: '商品管理',
      icon: 'shopping'
    },
    children: [{
        path: 'selfrun-manage',
        redirect: '/goods-manage/selfrun-manage/list',
        component: () => import('@/views/goods-manage/selfrun-manage/index'),
        name: 'selfrun-manage',
        meta: {
          title: '自营商品库'
        },
        children: [{
            path: 'goods-add',
            component: () => import('@/views/goods-manage/selfrun-manage/goods-add'),
            name: 'goods-add',
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
            meta: {
              title: '自营编辑',
              type: 'store'
            },
          },
          {
            path: 'goods-cates',
            component: () => import('@/views/goods-manage/goods-cates'),
            name: 'goods-cates',
            meta: {
              title: '店铺分类',
              type: 'store'
            },
          },
          {
            path: 'list',
            component: () => import('@/views/goods-manage/list'),
            name: 'list',
            meta: {
              title: '商品列表',
              type: 'store'
            },

          },
          {
            path: 'banchuan',
            component: () => import('@/views/goods-manage/list'),
            name: 'banchuan',
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
        meta: {
          title: '板川商品库'
        },
        children: [{
            path: 'goods-add',
            component: () => import('@/views/goods-manage/banchuan-manage/goods-add'),
            name: 'goods-add',
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
            meta: {
              title: '板川编辑',
              type: 'basic'
            },
          },
          {
            path: 'goods-cates',
            component: () => import('@/views/goods-manage/goods-cates'),
            name: 'goods-cates',
            meta: {
              title: '板川分类',
              type: 'basic'
            },
          },
          {
            path: 'list',
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
    meta: {
      title: '服务人员',
      icon: 'theme'
    },
    alwaysShow: true,
    children: [{
      path: 'list',
      name: 'list',
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
    meta: {
      title: '优惠券管理',
      icon: 'star'
    },
    alwaysShow: true,
    children: [{
      path: 'list',
      name: 'list',
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
    meta: {
      title: '积分商城',
      icon: 'icon'
    },
    alwaysShow: true,
    children: [{
        path: 'list',
        name: 'list',
        component: () => import('@/views/credit-shop/list'),
        meta: {
          title: '积分商品'
        }
      },
      {
        path: 'goods-add',
        name: 'goods-add',
        component: () => import('@/views/credit-shop/goods-add'),
        meta: {
          title: '新增商品'
        }
      },
      {
        path: 'goods-edit',
        name: 'goods-edit',
        hidden: true,
        component: () => import('@/views/credit-shop/goods-add'),
        meta: {
          title: '编辑商品'
        }
      },
      {
        path: 'goods-cates',
        name: 'goods-cates',
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
    meta: {
      title: '砍价商品',
      icon: 'form'
    },
    alwaysShow: true,
    children: [{
        path: 'list',
        name: 'bargain-list',
        component: () => import('@/views/bargain-goods/list'),
        meta: {
          title: '商品列表'
        }
      },
      {
        path: 'goods-add',
        name: 'bargain-goods-add',
        component: () => import('@/views/bargain-goods/goods-add'),
        meta: {
          title: '新增商品'
        }
      },
      {
        path: 'goods-edit',
        name: 'bargain-goods-edit',
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
    meta: {
      title: '秒杀管理',
      icon: 'form'
    },
    alwaysShow: true,
    children: [{
        path: 'list',
        name: 'seckill-list',
        component: () => import('@/views/seckill-manage/list'),
        meta: {
          title: '活动列表'
        }
      },
      {
        path: 'goods-list',
        name: 'seckill-goods-list',
        hidden: true,
        component: () => import('@/views/seckill-manage/goods-list'),
        meta: {
          title: '秒杀商品列表'
        }
      },
      {
        path: 'goods-edit',
        name: 'seckill-goods-edit',
        hidden: true,
        component: () => import('@/views/seckill-manage/goods-add'),
        meta: {
          title: '秒杀商品编辑'
        }
      },
      {
        path: 'goods-add',
        name: 'seckill-goods-add',
        hidden: true,
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
    meta: {
      title: '案例管理',
      icon: 'star'
    },
    alwaysShow: true,
    children: [{
      path: 'classlist',
      name: 'classlist',
      component: () => import('@/views/case-manage/classlist'),
      meta: {
        title: '案例分类'
      }
    }]
  },

  // 开店申请
  {
    path: '/shopapply-manage',
    component: Layout,
    redirect: '/shopapply-manage/record',
    name: 'shopapply-manage',
    meta: {
      title: '开店申请',
      icon: 'star'
    },
    alwaysShow: true,
    children: [{
      path: 'record',
      name: 'shopapply-record',
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
    meta: {
      title: '订单管理',
      icon: 'star'
    },
    alwaysShow: true,
    children: [{
      path: 'list',
      name: 'order-list',
      component: () => import('@/views/order-manage/list'),
      meta: {
        title: '订单列表'
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
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router