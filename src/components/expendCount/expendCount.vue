<template>
  <div class="expendCount">
     <div class="expendCountHeader">
        <span class="fa fa-arrow-left" @click="goBack" :style="{color: color}"></span>
        <span class="text">支出统计</span>
    </div>
    <div class="expendCountContent">
      <div class="selectDate"> 
        <!--日历选择器-->
        <div class="originDatePickerWraper datePickerWraper" v-if="onOff">
          <van-datetime-picker
            v-model="currentDate1"
            type="date"
            class="originDatePicker datePicker"
            @confirm="originConfirm"
            @cancel="originCancel"
            @change="originDateChange"
            :itemHeight="itemHeight"
            :title ="originTitle"
          />
        </div>
         <div class="abortDatePickerWraper datePickerWraper" v-if="showHide">
          <van-datetime-picker
            v-model="currentDate2"
            type="date"
            class="abortDatePicker datePicker"
            @confirm="abortConfirm"
            @cancel="abortCancel"
            @change="abortDateChange"
            :itemHeight="itemHeight"
            :title ="abortTitle"
            :min-date ="minDate"
          />
        </div>
        <i class="fa fa-calendar" :style="{color: color}"></i>
        <span class="originDate" @click="showTimePicker1" ref='originDate'>{{originDate}}</span>
        <span>至</span>
        <span class="abortDate" @click="showTimePicker2" ref='abortDate'>{{abortDate}}</span>
      </div>
      <!--线性表容器-->
      <div class="lineChartWraper" ref="lineChart">
      </div>
      <!--饼装图容器-->
      <div class="pieChartWraper" ref="pieChart"></div>
    </div>
  </div>
</template>
<script>
let echarts = require("echarts/lib/echarts");

export default {
  data() {
    return {
      lineChart: {},
      pieChart: {},
      currentDate1: "",
      currentDate2: new Date(),
      itemHeight: 38, // 日历行高
      onOff: false,
      showHide: false,
      originTitle: "", // 起始日期标题
      abortTitle: "", // 截止日期标题
      originDate: "", // 起始时间，
      abortDate: "", // 截止时间
      minDate: "", // 截止时间的最小值，大于等于起始时间
      data: "", // 总的数据
      lineChartXData: [], // 条形统计图数据
      lineChartYData: [],
      pieChartData: [], // 圆形统计图数据
      id: this.$store.state.billNote_id,
      color: this.$store.state.themeColor // 主题颜色
    };
  },
  watch: {
    // 结束日期改变从新发起请求
    abortDate(date) {
      this.getData();
    },
    // 起始日期改变重新发起请求
    originDate(date) {
      this.getData();
    },
    // 请求数据后绘制图表
    data(val) {
      let lineData = val.expenditure_statistics;
      let pieData = val.classification_statistics;
      let [obj, arr1, arr2, arr3] = [{}, [], [], []];
      lineData.forEach((val, key) => {
        arr1.push(val.date);
        arr2.push(val.amount);
      });
      this.lineChartXData = arr1;
      this.lineChartYData = arr2;
      pieData.forEach((val, key) => {
        obj = {
          value: val.amount,
          name: val.classification_name
        };
        arr3.push(obj);
      });
      this.pieChartData = arr3;
      this.drawLineChart(); // 获取数据后调用方法绘制图表
      this.drawPieChart();
    }
  },
  methods: {
    getData() {
      this.$http
        .get("http://billing.gzpeifeng.com/user/bill/expenditure_statistics", {
          params: {
            account_book_id: this.id,
            start_time: this.originDate,
            end_time: this.abortDate
          }
        })
        .then(req => {
          this.data = req.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    goBack() {
      this.$router.go(-1);
    },
    // 格式化日期
    formatDate(date, isDay, isCn) {
      // 给个位的月份和天数前面加零
      this.dealMonthDay = function(value) {
        let dealValue;
        if (value < 10) {
          dealValue = "0" + value;
        } else {
          dealValue = value;
        }
        return dealValue;
      };
      let [year, month, day, dateStr] = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      ];
      let trim = " "; // 空格（带数字的时间需要空格）
      if (isDay) {
        if (isCn) {
          dateStr = `${year}年${trim}${month}月${trim}${day}日`;
        } else {
          // let deal = this.dealMonthDay
          month = this.dealMonthDay(month);
          day = this.dealMonthDay(day);
          dateStr = `${year}-${month}-${day}`;
        }
      } else {
        if (isCn) {
          dateStr = `${year}年${trim}${month}月`;
        } else {
          month = deal(month);
          day = deal(day);
          dateStr = `${year}-${month}`;
        }
      }
      return dateStr;
    },

    initialDate() {
      let abortDateStr = this.formatDate(new Date(), true, false);
      let originDateStr = abortDateStr.substring(0, 7) + "-01";
      this.originDate = originDateStr; // 初始起始日期为当月的第一天
      this.abortDate = abortDateStr; // 初始截止日期为当天
      this.originTitle = this.formatDate(new Date(originDateStr), true, true); // 初始起始日历标题
      this.abortTitle = this.formatDate(new Date(), true, true); // 初始截止日历标题
      this.currentDate1 = new Date(originDateStr); // 起始日历初始值
      this.minDate = new Date(originDateStr); // 初始截止日历最小值
    },
    // confirm 为点击确认的处理函数
    originConfirm(value) {
      this.onOff = false;
      this.currentDate2 = new Date(value);
      this.minDate = new Date(value); // 截止日期最小值
      this.abortTitle = this.formatDate(
        // 截止日历的标题
        new Date(value),
        true,
        true
      );
      this.originDate = this.formatDate(new Date(value), true, false);
    },
    abortConfirm(value) {
      this.showHide = false;
      this.abortDate = this.formatDate(new Date(value), true, false);
    },
    // 日期改变
    originDateChange(el) {
      // el 为 datePicker的实例
      // el.getColumnValue 方法获取对应列被选中项的innerhtml
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
      this.originTitle = `${year}年${trim}${month}月${trim}${day}日`;
    },
    abortDateChange(el) {
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
      this.abortTitle = `${year}年${trim}${month}月${trim}${day}日`;
    },
    // 关闭日历
    originCancel(e) {
      this.onOff = false;
    },
    abortCancel() {
      this.showHide = false;
    },
    // 展现日历
    showTimePicker1() {
      this.onOff = true;
    },
    showTimePicker2() {
      this.showHide = true;
    },
    // 折线图
    drawLineChart() {
      let lineChart = this.$refs.lineChart;
      let mylineChart = echarts.init(lineChart);
      mylineChart.setOption({
        title: {
          text: "每日支出统计图（可缩放）",
          textStyle: {
            fontSize: 14
          }
        }, // 标题
        tooltip: {
          trigger: "axis",
          textStyle: {
            fontSize: 12
          },
          axisPointer: {
          }
        },
        // 伸缩图形
        dataZoom: [
          {
            type: "inside", // type = 'inside'通过滑动查看完整图形
            start: 0,
            end: 100
          }
        ],
        // x轴
        xAxis: [
          {
            type: "category",
            data: this.lineChartXData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        // y轴的值
        series: [
          {
            data: this.lineChartYData,
            type: "line",
            smooth: true,
            // 显示y轴数值
            // label: {
            //   normal: {
            //     show: true,
            //     position: "top",
            //     color: "#888"
            //   }
            // }
          }
        ],

        itemStyle: {
          // 点的颜色。
          color: "#ff6600"
        },
        grid: {
          left: "3%",
          right: "5%",
          bottom: "3%",
          containLabel: true
        }
      });
      this.lineChart = mylineChart; //将线形图实例储存起来，窗口大小改变时重绘
    },
    // 饼状图
    drawPieChart() {
      let pieChart = this.$refs.pieChart;
      let mypieChart = echarts.init(pieChart);
      mypieChart.setOption({
        title: {
          text: "分类支出统计图",
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/> {c} ({d}%)",
          textStyle: {
            fontSize: 10
          }
        },

        series: [
          {
            type: "pie",
            radius: "60%",
            center: ["50%", "55%"], // 图形占容器x、y轴的比例
            data: this.pieChartData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            label: {
              normal: {
                formatter: " {b} : \n （{d}）%"
              }
            }
          }
        ]
      });

      this.pieChart = mypieChart;
    }
  },
  created() {
    // console.log(this.$store.state.num);
    this.initialDate();
  },
  mounted() {
    // 页面大小改变时重绘图形
    window.onresize = () => {
      this.lineChart.resize();
      this.pieChart.resize();
    };
  }
};
</script>
<style lang="less" scoped>
.expendCount {
  font-size: 1.2rem;
  .expendCountHeader {
    text-align: center;
    position: relative;
    padding: 1rem 0;
    // border-bottom: 1px solid #ddd;
    font-size: 1.7rem;
    // color: #222;
    box-shadow: 0 0.1rem 0.4rem #464652;
    margin-bottom: 0.4rem;
    span.fa {
      position: absolute;
      left: 5%;
      height: 2rem;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .expendCountContent {
    .selectDate {
      height: 4.5rem;
      line-height: 4.5rem;
      text-align: center;
      border-bottom: 0.1rem solid #ddd;
      margin-bottom: 0.8rem;
      i.fa-calendar {
        margin-right: 0.2rem;
        font-size: 1.6rem;
      }
      span.originDate,
      span.abortDate {
        width: 8rem;
        display: inline-block;
      }
      span.originDate {
        margin-right: 1.5rem;
      }
      span.abortDate {
        margin-left: 1.5rem;
      }
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
    }
    // 线形图
    .lineChartWraper {
      padding: 2rem 2rem 0 1.5rem;
      height: 30rem;
    }
    // 饼状图
    .pieChartWraper {
      height: 280px;
      padding: 2rem 2rem 0 1.5rem;
    }
  }
}
</style>
