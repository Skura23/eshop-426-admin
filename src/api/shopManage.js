import request from '@/utils/request'

var api = {
  getShopList(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "factory_list|factory",
        ...data
      }
    })
  },
  factory_change_status(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "factory_change_status|factory",
        ...data
      }
    })
  },
  factory_detail(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "factory_detail|factory",
        ...data
      }
    })
  },
  factory_edit(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "factory_edit|factory",
        ...data
      }
    })
  },
  switch_factory_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "switch_factory_list|factory",
        ...data
      }
    })
  },
  switch_factory(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "switch_factory|factory",
        ...data
      }
    })
  },
  first_level_factory_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "first_level_factory_list|factory",
        ...data
      }
    })
  },
  factory_create(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "factory_create|factory",
        ...data
      }
    })
  },
  // clients manage apis
  member_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "member_list|member",
        ...data
      }
    })
  },
  member_create(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "member_create|member",
        ...data
      }
    })
  },
  batch_member_create_excel(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "batch_member_create_excel|member",
        ...data
      }
    })
  },
  batch_member_create_upload(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "batch_member_create_upload|member",
        ...data
      }
    })
  },
  member_excel_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "member_excel_list|member",
        ...data
      }
    })
  },
  member_excel_upload(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "member_excel_upload|member",
        ...data
      }
    })
  },
  member_tag_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "member_tag_list|config",
        ...data
      }
    })
  },
  member_tag_create(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "member_tag_create|config",
        ...data
      }
    })
  },
  member_tag_edit(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "member_tag_edit|config",
        ...data
      }
    })
  },
  tag_delete(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "tag_delete|config",
        ...data
      }
    })
  },
  tag_member_create(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "tag_member_create|member",
        ...data
      }
    })
  },
  tag_member_delete(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "tag_member_delete|member",
        ...data
      }
    })
  },
  // 员工管理
  this_auth_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "this_auth_list|factory",
        ...data
      }
    })
  },
  auth_create(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "auth_create|factory",
        ...data
      }
    })
  },
  auth_edit(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "auth_edit|factory",
        ...data
      }
    })
  },
  // 岗位管理
  group_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "group_list|factory",
        ...data
      }
    })
  },
  group_auth_cache_delete(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "group_auth_cache_delete|factory",
        ...data
      }
    })
  },
  group_create(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "group_create|factory",
        ...data
      }
    })
  },
  group_edit(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "group_edit|factory",
        ...data
      }
    })
  },
  group_auth_rule(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "group_auth_rule|factory",
        ...data
      }
    })
  },
  group_auth_edit(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "group_auth_edit|factory",
        ...data
      }
    })
  },
  // 商品管理
  goods_share_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "goods_share_list|goods",
        ...data
      }
    })
  },
  // --商品分类
  parent_class_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "parent_class_list|goods",
        ...data
      }
    })
  },
  class_create(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "class_create|goods",
        ...data
      }
    })
  },
  all_class_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "all_class_list|goods",
        ...data
      }
    })
  },
  class_detail(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "class_detail|goods",
        ...data
      }
    })
  },
  class_edit(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "class_edit|goods",
        ...data
      }
    })
  },
  class_delete(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "class_delete|goods",
        ...data
      }
    })
  },
  use_class_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "use_class_list|goods",
        ...data
      }
    })
  },
  // --商品新增、编辑
  cascader_cache_class_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "cascader_cache_class_list|goods",
        ...data
      }
    })
  },
  goods_create(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "goods_create|goods",
        ...data
      }
    })
  },
  // --自营相关
  factory_goods_detail(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "factory_goods_detail|goods",
        ...data
      }
    })
  },
  goods_store_edit(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "goods_store_edit|goods",
        ...data
      }
    })
  },
  factory_store_goods_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "factory_store_goods_list|goods",
        ...data
      }
    })
  },
  factory_store_goods_putaway(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "factory_store_goods_putaway|goods",
        ...data
      }
    })
  },
  factory_basic_goods_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "factory_basic_goods_list|goods",
        ...data
      }
    })
  },
  factory_store_goods_putaway(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "factory_store_goods_putaway|goods",
        ...data
      }
    })
  },
  // factory_basic_goods_price_update(data) {
  //   return request({
  //     url: '',
  //     method: 'post',
  //     data: {
  //       "apiName": "factory_store_goods_putaway|goods",
  //       ...data
  //     }
  //   })
  // },
  factory_basic_goods_putaway(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "factory_basic_goods_putaway|goods",
        ...data
      }
    })
  },
  // 板川相关
  basic_goods_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "basic_goods_list|goods",
        ...data
      }
    })
  },
  basic_goods_detail(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "basic_goods_detail|goods",
        ...data
      }
    })
  },
  basic_goods_edit(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "basic_goods_edit|goods",
        ...data
      }
    })
  },
  goods_items_edit(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "goods_items_edit|goods",
        ...data
      }
    })
  },
  // 服务人员 相关
  services_staff_list(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "services_staff_list|services",
        ...data
      }
    })
  },
  services_staff_create(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "services_staff_create|services",
        ...data
      }
    })
  },
  services_staff_delete(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": "services_staff_delete|services",
        ...data
      }
    })
  },
}

// 后续通过遍历生成接口
// 调用方法: api.services_staff_edit
let apiList = [
  // 服务人员 相关
  "services_staff_edit|services",
  // 优惠券
  "coupon_create|coupon",
  "coupon_list|coupon",
  "coupon_detail|coupon",
  "coupon_delete|coupon",
  "coupon_change_status|coupon",
  // 积分商城 商品
  "integral_goods_create|integral",
  "integral_goods_list|integral",
  "integral_goods_detail|integral",
  "integral_goods_edit|integral",
  "integral_goods_put_away|integral",
  // 砍价商品
  "bargain_goods_create|bargain",
  "bargain_goods_list|bargain",
  "bargain_goods_edit|bargain",
  "bargain_goods_detail|bargain",
  "bargain_goods_put_away|bargain",
  // 秒杀活动
  "seckill_create|seckill",
  "seckill_list|seckill",
  "seckill_edit|seckill",
  "seckill_detail|seckill",
  "seckill_goods_create|seckill",
  "seckill_goods_edit|seckill",
  "seckill_goods_list|seckill",
  "seckill_goods_detail|seckill",
  "seckill_goods_put_away|seckill",
  "seckill_delete|seckill",
  // 开店申请
  "admin_factory_request_list|factory",
  "factory_request_check|factory",
  "factory_list|factory",

  // 订单管理
  "order_list|order",

  // 其他
  "check_cases_comment_list|cases",
  "check_update|cases",
  "apply_list|factory",
  "factory_basic_goods_price_update|goods",
  "store_goods_create|goods",
  "apply_create|factory",
  "apply_detail|factory",
  "order_send|order",
  "apply_bound|factory",
  "factory_fee_edit|factory",
  "menu_list|factory",
]

// 调用方法: api["class_create|integral"]
let apiList2 = [
  // 积分商城 分类
  "class_create|integral",
  "class_edit|integral",
  "class_delete|integral",
  "class_list|integral",
  // 案例分类
  "case_class_create|cases",
  "case_class_edit|cases",
  "case_class_delete|cases",
  "case_class_list|cases",
]

apiList.forEach(element => {
  let name = element.split('|')[0]
  api[name] = function name(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": element,
        ...data
      }
    })
  }
});

apiList2.forEach(element => {
  let name = element
  api[name] = function name(data) {
    return request({
      url: '',
      method: 'post',
      data: {
        "apiName": element,
        ...data
      }
    })
  }
});
export default api