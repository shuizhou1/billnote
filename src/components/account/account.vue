<template>
  <section class="editRecord">
    <div class="editRecordHeader">
        <span class="fa fa-arrow-left" @click="goBack" :style="{color: color}"></span>
        <span class="text">账单详情（只读）</span>
    </div>
    <div class="editRecordBody">
      <div class="billNum clearfix">
        <span class="billNumKey">金额</span>
        <span class="billNumVal">{{billNum}}</span>
        <!-- <span>{{billNum}}</span> -->
      </div>
      <div class=" clearfix date">
        <span>日期</span>
        <div class="dateRight">
          <i class="fa fa-calendar" @click="showTimePicker" :style="{color: color}"></i>
           <span  ref="date">{{date}}</span>
        </div>
      </div>
      <div class="category clearfix">
        <span>类别</span>
        <div class="categoryRight">
           <i :class="`fa ${icon}`" :style="{color: color}"></i>
           <span>{{subdivide}}</span>
        </div>
      </div>
      <div class="remark clearfix">
        <span>备注</span>
        <span class="remarkVal">{{remarks}}</span>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      date: "",
      remarks: "", // 备注
      billNum: "", // 金额
      subdivide: "",
      icon: "",
      color: this.$store.state.themeColor,
      obj: ""
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    initialData() {
      (this.date = this.$route.params.obj.date.substring(0, 10)),
        (this.remarks = this.$route.params.obj.remarks),
        (this.billNum = this.$route.params.obj.amount),
        (this.icon = this.$route.params.obj.icon),
        (this.subdivide = this.$route.params.obj.subdivide);
    }
  },
  created() {
    this.initialData();
  }
};
</script>


<style lang="less">
.editRecord {
  font-size: 1.4rem;
  .editRecordHeader {
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
  .editRecordBody {
    > div {
      padding: 1.1rem 2.5rem 1.1rem 1.8rem;
      border-bottom: 0.1rem solid #ddd;
      color: #555555;
    }
    div.billNum {
      span.billNumVal {
        float: right;
      }
    }

    // 日期
    div.date {
      padding: 0 2.3rem 0 1.8rem;
      height: 4.2rem;
      line-height: 4.2rem;
      position: relative;
      .dateRight {
        float: right;
        span {
          margin-left: 0.5rem;
          font-size: 1.2rem;
        }
      }
      > span {
        display: inline-block;
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
      span.remarkVal {
        float: right;
      }
    }
  }
}
</style>
