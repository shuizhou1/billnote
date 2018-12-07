<template>
  <section class="billCategory">
    <div class="billCategoryHeader">
      <span class="fa fa-arrow-left" @click="goBack" :style="{color: color}"></span>
      <span class="text">{{title}}</span>
    </div>
    <div class="category">
      <!-- <p></p> -->
      <ul class="categoryList">
        <li v-for="(item, i) in categoryArr"
            :key="i" @click="getIndex($event, i)" 
            :class="{active: i == currentIndex}">
          <p>
            <i :class="`fa ${item.icon}`" :style="{color: color}"></i>
            <span>{{item.classification_name}}</span>
          </p>
        </li>
      </ul>
      <ul class="subdivideList">
        <li v-for="(item, ind) in categoryArr" 
            :key="ind" 
            :class="[{active: ind == currentIndex}, {hideIcon: item.classification_name == '常用' }]">
          <p class="title">
            <i :class="`fa ${item.icon}`" :style="{color: color}"></i>
            <span>{{item.classification_name}}</span>
          </p>
          <ul class="childList">
            <li v-for="(val, eq) in item.data" :key="eq">
              <p @click="toAddRecord(item.classification_id, val.id, item.classification_name, val.subdivide_name, item.icon)">
                <span>{{val.subdivide_name}}</span>
              </p>
              <i class="fa fa-trash" @click="deleteSubdivide(item.classification_id, val.id, ind, eq)"></i>
            </li>     
          </ul>
          <div class="addchildCategory">
            <div class="subdivide" ref="subdivide">
              <input type="text"
                     class="subdivideName"
                     placeholder="输入子类名称"
                     @keyup.enter="addSubdivide($event, item.classification_id, ind)"
                     @blur="hideInput(ind)"
              >
            </div>
            <div class="iconWraper"  ref="iconWraper" >
              <i class="fa fa-plus-circle" @click="showInput(ind)" :style="{color: color}"></i>
              <span>添加子分类</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      categoryArr: [],
      iconArr: sessionStorage.getItem(""),
      currentIndex: 0,
      color: this.$store.state.themeColor,
      inOut: this.$route.params.inOut,
      title: ''
    };
  },
  computed: {},
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取数据
    getData() {
      // 支出类别
      if (this.inOut === "2") {
        this.$http
          .get("http://billing.gzpeifeng.com/user/classification/get_classification_and_subdivide_list")
          .then(req => {
            this.categoryArr = req.data.data;
            this.title = '支出类别'
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // 收入类别
        this.$http
          .get("http://billing.gzpeifeng.com/user/classification/get_classification_for_income")
          .then(req => {
            this.categoryArr = req.data.data;
            this.title = '收入类别'
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 控制二级分类的展示
    getIndex(e, ind) {
      this.currentIndex = ind;
    },
    // 展现添加子分类输入框
    showInput(ind) {
      let subdivide = this.$refs.subdivide[ind];
      let iconWraper = this.$refs.iconWraper[ind];
      subdivide.style.zIndex = `0`;
      subdivide.style.transform = `translateY(0)`;
      iconWraper.style.transform = `translateY(0)`;
    },
    //隐藏子分类输入框
    hideInput(ind) {
      let subdivide = this.$refs.subdivide[ind];
      let iconWraper = this.$refs.iconWraper[ind];
      subdivide.style.zIndex = `-1`;
      subdivide.style.transform = `translateY(-100%)`;
      iconWraper.style.transform = `translateY(-3.5rem)`;
    },
    // 添加子分类
    addSubdivide(e, id, key1) {
      let event = e || window.event;
      let val = event.target.value;
      console.log(id);
      this.$http
        .post("http://billing.gzpeifeng.com/user/classification/add_subdivide", {
          classification_id: id,
          subdivide_name: val
        })
        .then(req => {
          console.log(req.data);
          this.getData();
          event.target.value = "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除子分类
    deleteSubdivide(id1, id2, key1, key2) {
      // this.categoryArr[key1].data.splice(key2, 1)
      this.$http
        .post("http://billing.gzpeifeng.com/user/classification/delete_subdivide", {
          classification_id: id1,
          id: id2
        })
        .then(req => {
          console.log(req.data);
          this.getData();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 重定向到添加记录页
    toAddRecord(id1, id2, name1, name2, icon) {
      this.$store.state.billcategoryParams = {
        superID: id1,
        subdivideID: id2,
        superName: name1,
        subdivide: name2,
        icon: icon
      }
      this.$router.go(-1)
    }
  },
  created() {
    this.getData();
    // $(document.body).height(window.innerHeight);
  }
};
</script>
<style lang="less" scoped>
.billCategory {
  font-size: 1.4rem;
  .billCategoryHeader {
    text-align: center;
    position: fixed;
    z-index: 99;
    left: 0;
    top: 0;
    right: 0;
    background: #fff;
    // padding: 1rem 0;
    height: 4.2rem;
    border-bottom: 1px solid #ddd;
    font-size: 1.6rem;
    color: #222;
    line-height: 4.2rem;
    span.fa {
      position: absolute;
      left: 5%;
      height: 2rem;
      top: 50%;
      margin-top: -1rem;
    }
  }
  .category {
    position: relative;
    height: 100%;
    .categoryList {
      position: fixed;
      left: 0;
      top: 4.4rem;
      bottom: 0;
      right: 72%;
      background: #e9e9e9;
      box-shadow: 0.2rem 0 0.5rem #666;
      li.active {
        background-color: rgba(100, 100, 100, 0.3);
        color: aliceblue;
      }
      li {
        height: 3rem;
        p {
          position: relative;
          height: 2.9rem;
          line-height: 2.9rem;
          margin: 0 1rem;
          border-bottom: 0.1rem solid #ccc;
          i {
            font-size: 1.6rem;
            margin-left: 0.2rem;
            width: 19px;
            // height: 18px;
          }
          span {
            // margin-left: .2rem;
          }
        }
      }
    }
    // 右边的二级分裂列表
    .subdivideList {
      background: #fff;
      position: absolute;
      right: 0;
      left: 29%;
      top: 4.4rem;
      > li.active {
        display: block;
      }
      >li.hideIcon .addchildCategory {
        display: none;
      }
      > li {
        display: none;
        position: relative;
        p.title {
          font-size: 1.8rem;
          background: #ecf2f0;
          height: 4.5rem;
          line-height: 4.5rem;
          text-align: center;
          i {
            margin-right: 0.3rem;
          }
        }
        ul.childList {
          li {
            height: 3.8rem;
            border-bottom: 0.1rem solid #ddd;
            margin: 0 1.5rem;
            position: relative;
            p {
              height: 3.8rem;
              span {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
              }
            }
            .fa-trash {
              position: absolute;
              right: 0.2rem;
              top: 50%;
              transform: translateY(-50%);
              color: #ff2200;
            }
          }
        }
        // 添加子分类
        .addchildCategory {
          div.subdivide {
            margin: 0 1.5rem;
            height: 3.5rem;
            // display: none;
            border-bottom: 0.1rem solid #ddd;
            position: relative;
            transform: translateY(-100%);
            transition: transform 0.3s;
            z-index: -1;
            input.subdivideName {
              font-size: 1.3rem;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              left: 0;
            }
          }
          div.iconWraper {
            margin-top: 1rem;
            text-align: center;
            transform: translateY(-3.5rem);
            transition: transform 0.3s;
          }
          .hideIconWraper {
            display: none;
          }
          .fa-plus-circle {
            font-size: 1.6rem;
            margin-right: 0.5rem;
          }
        }
      }
    }
  }
}
</style>

