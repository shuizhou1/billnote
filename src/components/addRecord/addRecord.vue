<template>
  <section class="addRecord">
    <div class="addRecordHeader">
        <span class="fa fa-arrow-left" @click="goBack" :style="{color: color}"></span>
        <span class="text">添加记录 </span>
    </div>
    <div class="form">
      <div class="billNum clearfix formItem">
        <span for="billNum" class="billNumText">金额</span>
        <input type="text" id="billNum" name="billNum" v-model="billNum" ref="billNum" v-focus>
        <!-- <span>{{billNum}}</span> -->
      </div>
      <div class="billInout formItem clearfix">
        <span>收支</span>
        <van-radio-group v-model="radio" class="radioGroup">
          <van-radio name="1">收入</van-radio>
          <van-radio name="2">支出</van-radio>
        </van-radio-group>
      </div>
      <div class="formItem clearfix date">
        <span>日期</span>
        <div class="dateRight">
          <span  ref="date">{{date}}</span>
          <i class="fa fa-calendar" @click="showTimePicker" :style="{color: color}"></i>
          <div class="datePickerWraper" v-if = 'onOff'>
             <van-datetime-picker
                v-model="currentDate"
                type="date"
                class="datePicker"
                :item-height = "itemHeight"
                @confirm = "confirm"
                @cancel = "cancel"
                @change="dateChange"
                ref="timePicker"
                :title="canlendarTitle" 
              />
          </div>   
        </div>
      </div>
      <div class="category clearfix formItem">
        <span>类别</span>
        <div class="categoryRight" @click="toBillCategory">
          <div v-if="subdivide">
             <i :class="`fa ${icon}`" :style="{color: color}"></i>
             <span>{{subdivide}}</span>
          </div>
          <div v-else>
            <span class="choice">请选择类别</span>
          </div>
        </div>
      </div>
      <div class="remark clearfix formItem">
        <span>备注</span>
        <div class="remarkRight">
           <input type="text"  name="remark" v-model="remarks">
        </div>
      </div>
      <button type="submit" class="btn" @click="addRecord" :style="{color: color, border: `.1rem solid ${color}` }">保存</button>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      radio: this.$store.state.radio, // 选中的单选框
      date: "",
      remarks: this.$store.state.billRemarks, // 备注
      billNum: this.$store.state.billNum, // 金额
      subdivide: this.$store.state.billcategoryParams.subdivide,
      icon: this.$store.state.billcategoryParams.icon,
      // 将这几项保存在state里避免选择类别后丢失数据
      currentDate: new Date(),
      onOff: false,
      itemHeight: 38, // 日历行高
      canlendarTitle: "",
      color: this.$store.state.themeColor,
      categoryID: this.$store.state.billcategoryParams.superID,
      subdivide_id: this.$store.state.billcategoryParams.subdivideID,
      categoryName: this.$store.state.billcategoryParams.superName
    };
  },
  methods: {
    goBack() {
      this.$router.push("/homePage");
    },
    // 跳转到分类选择页面
    toBillCategory() {
      this.$router.push({
        path: "/billCategory",
        name: "billCategory",
        params: {
          inOut: this.radio
        }
      });
      this.$store.state.radio = this.radio;
      this.$store.state.billNum = this.billNum;
      this.$store.state.billRemarks = this.remarks;
      this.$store.state.date = this.date;
    },
    // 保存记录
    addRecord() {
      this.$http
        .post("http://billing.gzpeifeng.com/user/bill/add", {
          account_book_id: this.$store.state.billNote_id,
          date: this.date,
          amount: this.billNum,
          income_expenditure: this.radio,
          classification_id: this.categoryID,
          subdivide_id: this.subdivide_id,
          classification_name: this.categoryName,
          subdivide_name: this.subdivide,
          remarks: this.remarks
        })
        .then(req => {
          if (req.data == "SUCCESS") {
            alert("保存成功！");
            this.$router.go(-1);
          } else {
            alert("保存失败");
          }
          this.remarks = "";
          this.billNum = "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 初始日期
    initialDate() {
      let date = new Date();
      this.$store.commit({
        type: "formatDate",
        date: new Date(),
        isDay: true,
        isCn: false
      });
      if (this.$route.params.bool) {
        this.date = this.$store.state.dateFormat;
      } else {
        this.date = this.$store.state.date;
      }
    },
    // 日历初始标题
    initialTitle() {
      let date = new Date();
      this.$store.commit({
        type: "formatDate",
        date: new Date(),
        isDay: true,
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
        isDay: true,
        isCn: false
      });
      this.date = this.$store.state.dateFormat;
    },
    // 关闭日历
    cancel(e) {
      this.onOff = false;
    },
    dateChange(el) {
      let [year, month, day, trim] = [
        el.getColumnValue(0),
        el.getColumnValue(1),
        el.getColumnValue(2),
        " "
      ];
      if (month[0] === "0") {
        month = month.substring(1, month.length);
      }
      if (day[0] === "0") {
        day = day.substring(1, day.length);
      }
      this.canlendarTitle = `${year}年${trim}${month}月${trim}${day}日`;
    },
    // 展现日历
    showTimePicker() {
      this.onOff = true;
    }
  },
  created() {
    this.initialDate();
    this.initialTitle();
    // 进入时初始化数据，否则会显示state里面储存的数据
    this.$store.state.radio = "2";
    this.$store.state.billNum = "";
    this.$store.state.billRemarks = "";
  }
};
</script>


<style lang="less">
.addRecord {
  font-size: 1.4rem;
  .addRecordHeader {
    text-align: center;
    position: relative;
    padding: 1rem 0;
    font-size: 1.7rem;
    box-shadow: 0 0.8rem #ecf2f0;
    margin-bottom: 0.8rem;
    span.fa {
      position: absolute;
      left: 5%;
      height: 2rem;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  div.form {
    div.formItem {
      padding: 1.1rem 2.5rem 1.1rem 1.8rem;
      border-bottom: 0.1rem solid #ddd;
      color: #555555;
    }
    div.billNum {
      input {
        float: right;
        text-align: right;
      }
    }
    // 收支
    div.billInout {
      position: relative;
      padding: 0 2.3rem 0 1.8rem;
      height: 4.2rem;
      > span {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      .van-radio-group {
        float: right;
        font-size: 1.3rem;
        position: absolute;
        top: 50%;
        right: 2.3rem;
        transform: translateY(-40%);
        .van-radio {
          display: inline-block;
          margin-left: 3rem;
          .van-radio__input {
            font-size: 12px;
            .van-icon-checked {
              color: #487ede;
            }
          }
          .van-radio__label {
            line-height: 14px;
            margin-top: 0.2rem;
          }
        }
      }
    }
    // 日期
    div.date {
      padding: 0 2.3rem 0 1.8rem;
      height: 4.2rem;
      line-height: 4.2rem;
      .dateRight {
        float: right;
        border: 0.1rem solid #ddd;
        border-radius: 3%;
        height: 3.6rem;
        // line-height: 3.6rem;
        margin-top: 0.2rem;
        width: 25rem;
        position: relative;
        .datePickerWraper {
          position: fixed;
          z-index: 99;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          .datePicker {
            z-index: 999;
            position: absolute;
            top: 25%;
            left: 10%;
            right: 10%;
            bottom: 35%;
            box-shadow: 0.5rem 1rem 0.5rem #222;
          }
        }
        span,
        i {
          position: absolute;
          top: 50%;
          // width: 20px;
          // height: 10px;
          transform: translateY(-50%);
        }
        span {
          left: 1.2rem;
          font-size: 1.2rem;
        }
        i {
          float: right;
          right: 1rem;
          color: #ff6600;
        }
      }
      > span {
        display: inline-block;
        // height: 1.6rem;
        // margin-top: 1.2rem;
      }
    }
    // 分类
    div.category {
      .categoryRight {
        float: right;
        span.choice {
          font-size: 1.3rem;
        }
        i {
          margin-right: 0.2rem;
          color: #ff6600;
        }
      }
    }
    // 备注
    div.remark {
      padding: 0 2.3rem 0 1.8rem;
      height: 4.2rem;
      line-height: 4.2rem;
      .remarkRight {
        float: right;
        width: 25rem;
        height: 3.6rem;
        line-height: 3.6rem;
        border: 0.1rem solid #ddd;
        margin-top: 0.2rem;
        border-radius: 3%;
        input {
          margin-left: 1rem;
          font-size: 1.4rem;
        }
      }
    }
    .btn {
      width: 7rem;
      height: 3.4rem;
      border-radius: 8%;
      position: absolute;
      left: 50%;
      margin-left: -3.5rem;
      font-size: 1.8rem;
      margin-top: 1rem;
      background: #ffffff;
    }
  }
}
</style>
