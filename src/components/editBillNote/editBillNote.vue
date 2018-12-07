<template>
    <div class="editBillNote">
      <div class="billNoteHeader">
        <span class="fa fa-arrow-left" @click="goBack" :style="{color: themeColor}"></span>
        <span class="text">编辑账本</span>
      </div>
       <form method="post" id="form1" onsubmit="return false">
        <div class="formItem billNoteName">
          <span>账本名称</span>
          <input type="text"
                 placeholder="请输入账本名"   
                 name="biiNoteName"  
                 v-focus 
                 v-model="billNoteName">
        </div>
        <div class="formItem defaultWraper" >
          <span class="defaultText">默认账本</span>
          <i class="fa fa-check-circle" :class="{active: isDefault}" @click="toggleDefault"></i>
        </div>
        <div class="formItem colorWraper">
          <span>标签颜色</span>
          <swatches v-model="color" 
                    colors="text-advanced" 
                    class="colorPicker" 
                    :trigger-style="cpickerSize">
          </swatches>
        </div>
        <div class="remarkWraper formItem">
          <span class="remarks">备注：</span>
          <textarea name="billNoteRemarks" v-model="remarks"></textarea>
        </div>
       <button type="submit" 
               class="btn" 
               @click="save" 
               :style="{color: themeColor, border: `.1rem solid ${themeColor}` }">保存</button>
    </form>
  </div>
</template>
<script>
import swatches from "vue-swatches"; // 颜色拾取插件
import "vue-swatches/dist/vue-swatches.min.css";
export default {
  name: "editbillNote",
  components: {
    swatches
  },
  data() {
    return {
      isDefault: this.$route.params.isDefault,
      themeColor: this.$store.state.themeColor,
      color: this.$route.params.color,
      id: this.$route.params.id,
      billNoteName: this.$route.params.name,
      remarks: "",
      cpickerSize: {
        // 颜色选择器的样式
        width: "16px",
        height: "16px",
        borderRadius: "20%"
      }
    };
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  },
  methods: {
    // 是否默认账本
    toggleDefault() {
      // this.bool = !this.bool
      this.isDefault = this.isDefault == 0 ? 1 : 0;
    },
    goBack() {
      this.$router.go(-1);
    },
    save() {
      console.log();
      this.$http
        .post("http://billing.gzpeifeng.com/user/accountbook/edit", {
          id: this.id,
          account_book_name: this.billNoteName,
          is_default: this.isDefault,
          color: this.color,
          remarks: this.remarks
        })
        .then(req => {
          if (req.data == "SUCCESS") {
            alert("保存成功！");
            this.$router.go(-1);
          } else {
            alert("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
// 头部样式
.billNoteHeader {
  text-align: center;
  position: relative;
  padding: 1rem 0;
  box-shadow: 0 1rem #ecf2f0;
  font-size: 1.7rem;
  // color: #222;
  span.fa {
    position: absolute;
    left: 5%;
    height: 2rem;
    top: 50%;
    margin-top: -1rem;
  }
}
// 表单样式
#form1 {
  margin-top: 1rem;
  font-size: 1.4rem;
  position: relative;
  div.formItem {
    padding: 1rem 1.2rem 1rem 1.5rem;
    margin-bottom: 0.1rem;
    box-shadow: 0 0.1rem #ddd;
  }
  // 输入名字
  .formItem.billNoteName {
    input {
      margin-left: 0.5rem;
    }
  }
  // 备注
  .formItem.remarkWraper {
    height: 16rem;
    position: relative;
    span.remarks {
      position: absolute;
      left: 2rem;
      top: 0.8rem;
    }
    textarea {
      position: absolute;
      left: 6rem;
      top: 3rem;
      width: 25rem;
      height: 13rem;
      margin-left: 2rem;
      background: #fff;
    }
  }

  // 默认账本
  .formItem.defaultWraper {
    .fa-check-circle {
      margin-left: 0.5rem;
      font-size: 1.6rem;
    }
    .fa-check-circle.active {
      color: #4578d3;
    }
  }
  // 颜色拾取
  div.colorWraper {
    position: relative;
    height: 4rem;
    padding: 0;
    z-index: 99;
    span,
    .colorPicker {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    span {
      left: 1.5rem;
    }
    .colorPicker {
      width: 16px;
      height: 16px;
      left: 8rem;
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
</style>
