<template>
  <section class="selectbillNote">
     <div class="selectbillNoteHeader">
        <span class="fa fa-arrow-left" @click="goBack" :style="{color: themeColor}"></span>
        <span class="text">账本</span>
        <router-link to="/addBillNote">
           <i class="fa fa-plus-circle" :style="{color: themeColor}"></i>
        </router-link>
    </div>
    <ul class="billNoteList">
      <li class="clearfix" v-for="(val, ind) in billNoteArr" :key="ind">
        <span @click="toBillNotes(val.id, val.color)">
          <i class="fa fa-bookmark" :style="{color: val.color}"></i>
          <b class="name">{{val.account_book_name}}</b>
        </span>  
        <div class="listItemRight">
           <i class="fa fa-check-circle" :style="{color:val.is_default ? val.color : '#555'}">
          </i>
           <router-link 
             :to="{name: 'editBillNote',
             params:{id: val.id, name: val.account_book_name,
             color: val.color, isDefault: val.is_default}}">
             <i class="fa fa-pencil"></i>
           </router-link>
          <i class="fa fa-trash"
             aria-hidden="true"
             @click="deleteBillNote(val.id)"
          >
          </i>
        </div>
      </li>
    </ul>
  </section>
</template>
<script>
export default {
  name: "selectbillNote",
  data() {
    return {
      billNoteArr: [],
      is_default: false,
      themeColor: this.$store.state.themeColor
    };
  },
  methods: {
    // 获取所有账本
    getBillNote() {
      this.$http
        .get("http://billing.gzpeifeng.com/user/accountbook/get_account_book")
        .then(req => {
          this.billNoteArr = req.data.data;
          console.log(req.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除账本
    deleteBillNote(id) {
      this.$http
        .post("http://billing.gzpeifeng.com/user/accountbook/delete", { id })
        .then(req => {
          this.getBillNote();
        })
        .catch(err => {
          console.log(err);
        });
    },
    goBack() {
      this.$router.go(-1);
    },
    // 前往指定账本
    toBillNotes(id, color) {
      this.$store.state.themeColor = color; // 避免themeColor的值未改变时，元素渲染成上个值
      this.$router.push({
        name: "homePage",
        params: {
          id: id
        }
      });
    }
  },
  created() {
    $(document.body).height(window.innerHeight);
    this.getBillNote();
  }
};
</script>
<style lang="less" scoped>
.selectbillNote {
  font-size: 1.5rem;
  .selectbillNoteHeader {
    text-align: center;
    position: relative;
    font-size: 1.7rem;
    height: 4.2rem;
    line-height: 4.2rem;
    box-shadow: 0 0.1rem 0.4rem #464652;
    span.fa {
      position: absolute;
      left: 5%;
      height: 2rem;
      top: 50%;
      margin-top: -0.8rem;
    }
    i.fa {
      position: absolute;
      right: 5%;
      height: 2rem;
      top: 50%;
      font-size: 1.8rem;
      margin-top: -0.8rem;
    }
  }
  .billNoteList {
    position: absolute;
    top: 4.5rem;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ecf2f0;
    padding: 1rem 2.8rem 0 2.8rem;
    li {
      padding: 0.8rem 0;
      b {
        margin-left: 0.8rem;
        font-weight: normal;
        font-size: 1.5rem;
      }
      .fa-bookmark {
        font-size: 1.6rem;
      }
      .listItemRight {
        float: right;
        i.fa-trash {
          margin-left: 4rem;
        }
        i.fa-check-circle {
          margin-right: 4rem;
        }
        // 默认账本样式
      }
    }
  }
}
</style>
