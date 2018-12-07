<template>
  <section id="homeBillNote">
    <section class="homeNote_header">
      <div class="homeNote_title">
        <router-link to="/selectbillNote">
          <span>{{isDefault ? `${billNoteName}（默认账本）` : billNoteName}}</span>
        </router-link>  
      </div>
      <!-- 日历 -->
      <div class="homeNote_date">
        <div class="homeNote_dateLeft">
          <span  @click="showTimePicker">
             <i class="fa fa-calendar" :style="`color: ${color}`"></i>
             <span ref="originDate" class="date">{{date}}</span>
          </span>
          <div class="datePickerWraper" v-if = 'onOff'>
            <van-datetime-picker
              v-model="currentDate"
              type="year-month"
              class="datePicker"
              :item-height = "itemHeight"
              @confirm = "confirm"
              @cancel = "cancel"
              @change = "dateChange"
              ref="timePicker"
              :title="canlendarTitle" 
            />
          </div>
          
        </div>
        <router-link :to="{path: '/expendCount', params: {date: date}}">
           <i class="fa fa-pie-chart" :style="`color:${color}`"></i> 
        </router-link>
      </div>
    </section> 
    <section class="homeNote_baseMessage clearfix">
      <div class="iconWraper">
        <div class="icon" :style="{backgroundImage:`url(${portrait})`}"></div>
      </div>
      <div class="totalInOut">
        <p class="totalIn">收入<span :style="{color: color}">{{income_expend.income}}</span>元</p>
        <p class="totalOut">支出<span :style="{color: color}">{{income_expend.expenditure}}元</span>元</p>
      </div>
      <div class="toaddRecord">
        <router-link :to="{name: 'addRecord', params: {bool: true }}"><van-icon name="add-o" :style="`color: ${color}`"></van-icon></router-link>
      </div>
    </section>
    <section class="homeNote_details">
      <bill-details :streamData="streamData" :categoryData="categoryData" :date="date" :color="color"></bill-details>
    </section> 
  </section>
</template>

<script>
import billDetails from "./billDetails";
export default {
  name: "billNote",
  components: {
    billDetails
  },
  props: ['billNoteID'],
  data() {
    return {
      currentDate: new Date(),
      itemHeight: 38,
      onOff: false,
      color: "",
      streamData: [],
      categoryData: [],
      income_expend: {},
      canlendarTitle: "", // 日历标题
      date: "",
      billNoteName: "",
      id: this.$store.state.billNote_id,
      portrait:'',
      isDefault: ''
    };
  },
  watch: {
    date(newDate) {
      this.getData();
    }
  },
  computed: {},
  methods: {
    getData() {
      // 获取首页数据
      this.$http
        .get("http://billing.gzpeifeng.com/user/index/index", {
          params: {
            date: this.date,
            account_book_id: this.billNoteID ? this.billNoteID : this.id
          }
        })
        .then(req => {
          this.$store.state.homeData = req.data
          this.streamData = req.data.everyday_bill.data; // 流水
          this.categoryData = req.data.subtotal; // 分类数据
          this.income_expend = req.data.income_expenditure; // 收入支出
          this.$store.state.billNote_id = req.data.current_account_book[0].id; // 账本id
          this.billNoteName = req.data.current_account_book[0].account_book_name; // 账本名称
          this.$store.state.themeColor = req.data.current_account_book[0].color; // 主题颜色
          this.isDefault = req.data.current_account_book[0].is_default
          this.color = req.data.current_account_book[0].color;
        
        })
        .catch(err => {
          console.log(err);
        });
        // 获取用户信息
        this.$http.get('http://billing.gzpeifeng.com/user/index/get_user_info')
        .then( req => {
          this.portrait = req.data.data.headimgurl
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 初始日期
    initialDate() {
      this.$store.commit({
        type: "formatDate",
        date: new Date(),
        isDay: false,
        isCn: false
      });
      this.date = this.$store.state.dateFormat;
    },
    // 日历初始标题
    initialTitle() {
      let date = new Date();
      this.$store.commit({
        type: "formatDate",
        date: new Date(),
        isDay: false,
        isCn: true
      });
      this.canlendarTitle = this.$store.state.dateFormat;
    },
    // confirm 为点击选择日期确认的处理函数
    confirm(value) {
      this.onOff = false;
      this.$store.commit({
        type: "formatDate",
        date: new Date(value),
        isDay: false,
        isCn: false
      });
      this.date = this.$store.state.dateFormat;
      this.initialTitle();
    },
    // 关闭日历
    cancel(e) {
      this.onOff = false;
    },
    dateChange(el) {
      let [year, month, trim] = [
        el.getColumnValue(0),
        el.getColumnValue(1),
        " "
      ];
      if (month[0] === "0") {
        month = month.substring(1, month.length);
      }
      this.canlendarTitle = `${year}年${trim}${month}月`;
    },
    // 展现日历
    showTimePicker() {
      this.onOff = true;
    }
  },
  created() {
    this.initialDate();
    this.initialTitle();
  }
 
};
</script>
<style lang="less" scoped>
// 头部样式
.homeNote_header {
   background: #ecf2f0;
  .homeNote_title {
    font-size: 1.7rem;
    text-align: center;
    span {
      padding: .9rem 1.4rem;
      display: inline-block;
      border-bottom: 0.1rem solid #ddd;
    }
  }
  .homeNote_date {
    background: #ecf2f0;
    font-size: 1.6rem;
    padding: 1rem 1.5rem;
    position: relative;
    i.fa-pie-chart {
      position: absolute;
      right: 5%;
      top: 50%;
      height: 1.9rem;
      margin-top: -0.7rem;
      font-size: 1.8rem;
    }
    .homeNote_dateLeft {
      // 日历
      .datePickerWraper {
        font-size: 1.2rem;
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        .datePicker {
          z-index: 999;
          position: absolute;
          top: 25%;
          left: 15%;
          right: 15%;
          bottom: 40%;
          box-shadow: 0.5rem 1rem 0.5rem #222;
        }
      }
      span.date {
        font-size: 1.4rem;
        margin-left: 0.5rem;
      }
    }
  }
}
// 中间部分样式
.homeNote_baseMessage {
  background-image: url('../../assets/image/bg.jpg');
  background-size: 300% 500%;
  background-position: center left;
  position: relative;
  height: 13rem;
  div {
    // float: left;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .iconWraper {
    left: 15%;
    .icon {
      width: 6.5rem;
      height: 6.5rem;
      border-radius: 50%;
      background-position: center center;
      background-size: cover;
    }
  }
  .totalInOut {
    font-size: 1.2rem;
    left: 40%;
    span {
      font-size: 1.5rem;
      margin: 0 0.3rem;
    }
  }
  .toaddRecord {
    right: 12%;
    font-size: 3rem;
    width: 3.1rem;
    height: 3.1rem;
  }
}
</style>

