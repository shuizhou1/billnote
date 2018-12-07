<template>
    <div class="categoryStream">
      <div class="categoryStreamHeader">
        <span class="fa fa-arrow-left" @click="goBack" :style={color:color}></span>
        <span class="text">分类流水</span>
      </div>
      <div class="categoryStreamContent">
        <ul class="contentList">
          <li class="clearfix" v-for="(item, ind) in dataArr" :key="ind">
            <div class="contentLeft">
              <i :style="{color: color}" :class="` fa ${item.icon}`"></i>
            </div>
            <div class="details">
              <p><span class="subdivide">{{item.subdivide}}</span></p>
              <p><span class="date">{{item.date.substring(0,10)}}</span><span class="remark">{{item.remarks}}</span></p>
            </div>
            <div class="contentRight">
              <span class="sum">{{item.amount}}</span>
              <i class="fa fa-angle-right" @click="toAccount(item.amount, item.subdivide, item.remarks, item.date, item.icon)"></i>
            </div>
          </li>
        </ul>
      </div>  
    </div> 
</template>
<script>
export default {
  data() {
    return {
      param: this.$route.params,
      id: this.$store.state.billNote_id,
      date: this.$route.params.date,
      superCategory: this.$route.params.classification,
      category: this.$route.params.subdivide,
      color: this.$store.state.themeColor,
      dataArr: [],
      obj: {}
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getData() {
        this.$http
          .get("http://billing.gzpeifeng.com/user/bill/get_subdivide_bill", {
            params: {
              account_book_id: this.id,
              classification: this.superCategory,
              subdivide: this.category,
              date: this.date
            }
          })
          .then(req => {
              console.log(req.data.data)
            if(req.data.data[0].icon) {
              this.dataArr = req.data.data;
              sessionStorage.setItem("dataArr", JSON.stringify(this.dataArr));
            }else {
               this.dataArr = JSON.parse(sessionStorage.getItem("dataArr"))
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
    toAccount(a, s, r, d, i) {
      let param = {
        amount: a,
        subdivide: s,
        remarks: r,
        date: d,
        icon: i,
      };
      this.obj = param;
      this.$router.push({
        name: "account",
        params: {
          obj: param
        }
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style lang="less" scoped>
.categoryStream {
  font-size: 1.4rem;
  .categoryStreamHeader {
    text-align: center;
    position: relative;
    padding: 1rem 0;
    box-shadow: 0 1rem #ecf2f0;
    font-size: 1.7rem;
    margin-bottom: 1rem;
    span.fa {
      position: absolute;
      left: 5%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .categoryStreamContent {
    .contentList {
      margin: 4rem 1.5rem 0 1.5rem;
      li {
        border-bottom: .1rem solid #ddd;
        height: 4rem;
        position: relative;
        div {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        .contentLeft {
          // margin-top: -1.25rem;
          left: 0;
          i.fa {
            float: left;
            font-size: 2.5rem;
          }
        }
        div.details {
          font-size: 1rem;
          width: 20rem;
          // margin-top: -1.6rem;
          left: 10%;
          // height: 3.2rem;
          p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p:first-child {
            margin-bottom: 0.3rem;
          }
          .subdivide {
            font-size: 1.2rem;
          }
          .date {
            margin-right: 0.5rem;
          }
        }
        .contentRight {
          // height: 1.7rem;
          // margin-top: -0.5rem;
          right: 0;
          span.sum {
            margin-right: 4rem;
          }
          i {
            font-size: 1.6rem;
            width: 2rem;
          }
        }
      }
    }
  }
}
</style>
