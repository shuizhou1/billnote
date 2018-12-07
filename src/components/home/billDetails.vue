<template>
  <div class="homebillDetails">
    <van-tabs swipeable :color="color"> <!-- tab切换组件-->
      <van-tab title="流水" class="homeBilldetailStream">
          <ul class="stream_list borderBottom">
            <li v-for="(item, key) in sortStreamData" :key="key">
             <p class="dateWraper"> {{dealDate(item.date)}}<span class="dateAfter"></span></p>
              <ul class="stream_date_list"> 
                <li v-for="(val, index) in item.bill" :key="index" @click="toEditRecord(val)" class="borderTop">
                  <div class="category">
                    <i  :class="[`fa ${val.icon}`, {isIncom:val.classification === '收入'}]" :style="`color: ${color}`"></i>
                    <span class="categoryName">{{val.subdivide}}</span>
                    <span class="desc">{{val.remarks}}</span>
                  </div>
                  <span class="streamNum" :class="{isIncom:val.classification === '收入'}">{{val.classification === '收入' ? `+${val.amount}` : val.amount}}</span>
                </li>
              </ul>
            </li>
         </ul>
      </van-tab>
      <van-tab title="分类汇总" class="homeBillcategorySummary">
         <van-collapse v-model="activeNames2" accordion>
          <van-collapse-item  v-for ="(item, ind) in categoryData.subtoal" :key="ind" :name="ind">
            <div slot="title">
              <i :class="[`fa ${item.icon}`, { isIncom: item.classifiction_name == '收入'}]" :style="`color: ${color}`"></i>
              <span class="categoryName">{{item.classifiction_name}}</span> 
              <span class="totalNum"
                    :class="{isIncom:item.classifiction_name === '收入'}">
                    {{item.classifiction_name === "收入" ?` +${item.amount}` : item.amount}}</span>
            </div>
            <ul class="subdivideList">
              <li v-for="(val, eq) in item.subdivide" :key="eq" @click="toCategoryStream(val.classification_id, val.subdivide)">
                <span class="subdivideName">{{val.subdivide}}</span>
                <span class="subdivideNum">{{val.amount}}</span>
              </li>
            </ul>
          </van-collapse-item>
        </van-collapse>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
export default {
  props: ['streamData', 'categoryData', 'date','color'],
  data() {
    return {
      // activeNames1: [], // 绑定折叠面板的空数组
      activeNames2: [], // 绑定折叠面板的空数组
      data: {}, // 首页数据
    };
  },
  computed: {
    sortStreamData() {
      // 将流水数据按日期排序
      let data = this.streamData.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date)
      })
      return data
    }
  },
  methods: {
    dealDate(val) {
      let trim = ' '
      let date = new Date(val)
      let dateStr = `${date.getMonth()+1}月${date.getDate()}日`
      return dateStr
    },
    // 跳转到账目明细
    toEditRecord(item) {
      // this.$store.state.accountData =
      let param = {
        amount: item.amount,
        subdivide: item.subdivide,
        subdivide_id: item.subdivide_id,
        classification: item.classification,
        classification_id: item.classification_id,   
        remarks: item.remarks,
        date: item.date,
        icon: item.icon,
        income_expenditure: item.income_expenditure,
        id: item.id
      };

      this.$router.push({
        name: 'editRecord',
        params: {
          obj: param
        }
      })
    },
    // 跳转到分类流水
    toCategoryStream(val1, val2) {
      this.$router.push({
        name: 'categoryStream',
        params: {
          date: this.date,
          classification: val1,
          subdivide: val2
        }
      })
    }
  },
};
</script>
<style lang="less">
.homebillDetails {
  // 流水
  .homeBilldetailStream {
    position: relative;
    //一级列表
    .stream_list:after {

      position: absolute;
    }
    .stream_list {
      margin-top: 1rem;
      p.dateWraper {
        position: relative;
        height: 1.6rem;
        line-height: 1.6rem;
        padding-left: 0.8rem;
        font-size: 1.3rem;
        color: #777;
        span.dateAfter {
          position: absolute;
          left: 18%;
          right: 0;
          top: 50%;
          box-sizing: border-box;
          border-bottom: 1px solid #ddd;
          transform: scaleY(.5); 
        }
      }
      // 二级列表
      .stream_date_list {
        li {
          padding: 1rem 1.8rem;
          // border-bottom: 1px solid #ddd;
          position: relative;
          div.category {
            // padding-left: 1.8rem;
            span.categoryName {
              font-size: 1.4rem;
              color: #222;
            }
            i.fa {
              font-size: 1.4rem;
              width: 1.8rem;
            }
            i.isIncom {
              color: #ff2200 !important;
            }
            span.desc {
              font-size: 1.2rem;
              color: #777;
              margin-left: 0.4rem;
              display: inline-block;
              width: 20rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              vertical-align: bottom;
            }
          }
          span.streamNum {
            float: right;
            position: absolute;
            right: 1.8rem;
            transform: translateY(-50%);
            top: 50%;
            font-size: 1.4em;
          }
          .streamNum.isIncom {
            color: #ff2200 !important;
          }
        }
        li:last-child {
          border-bottom: none;
        }
      }
    }
  }
  // 分类汇总 {
  .homeBillcategorySummary {
    // 一级目录
    .van-cell {
      span.totalNum { // 总金额
        position: absolute;
        right: 10%;
        color: #555;
        font-size: 1.3rem;
      }
      span.isIncom {
        color: #ff2200 !important;
      }
      span.categoryName { // 大类名
        color: #222;
      }
      .fa {
        font-size: 1.4rem;
        width: 2rem;
      }
      .fa.isIncom {
        color: #ff2200!important;
      } 
    }
    // 二级目录
   .van-collapse-item__wrapper {
      .van-collapse-item__content {
        position: relative;
        padding: 0;
        ul.subdivideList {
          li {
            padding: 1rem 0 1rem 4rem;
            font-size: 1.2rem;
            // border-top: .1rem solid #eee;
            position: relative;
            span.subdivideNum {
              position: absolute;
              right: 10%;
            }
          }
          li:not(:first-child):before {
            content: " ";
            position: absolute;
            pointer-events: none;
            box-sizing: border-box;
            left: 15px;
            right: 0;
            top: 0;
            transform: scaleY(.5);
            border-top: 1px solid #ddd;
          }
          // li:first-child {
          //   border-top: none;
          // }
        }
       
      }
   } 
  }
}
</style>
