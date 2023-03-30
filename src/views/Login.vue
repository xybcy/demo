<template>
      <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
    
          <div class="title-container">
            <h3 class="title">后台管理系统</h3>
          </div>
    
          <el-form-item prop="username">
            <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
            prefix-icon="el-icon-user"
            />
          </el-form-item>
    
          <el-form-item prop="password">
            <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"   
            prefix-icon="el-icon-help"
            show-password
            />
          </el-form-item>
    
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>
    
        </el-form>
      </div>
</template>
    
<script>
    import { Message } from 'element-ui'
    import '../../mock'
    import 'js-cookie'
    
    export default {
      name: 'Login',
      data() {
        const validateUsername = (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入正确的用户名'))
          } else {
            callback()
          }
        }
        const validatePassword = (rule, value, callback) => {
          if (value.length < 6) {
            callback(new Error('密码不能少于6位'))
          } else {
            callback()
          }
        }
        return {
          loginForm: {
            username: '',
            password: ''
          },
          loginRules: {
            username: [{ required: true, trigger: 'blur', validator: validateUsername }],
            password: [{ required: true, trigger: 'blur', validator: validatePassword }]
          },
          loading: false,
          passwordType: 'password',
        }
      },
      methods: {
        handleLogin() {
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              this.loading = true
              const data = {
                username: this.loginForm.username.trim(), 
                password: this.loginForm.password 
              }
              this.$http.post('user/login', data).then(res => {
                const info = res.data
                if (info.code !== 20000) {
                  Message({
                    message: info.message || 'Error',
                    type: 'error',
                    duration: 5 * 1000
                  })
                  this.loading = false
                }else{
                  const token = info.data.token
                  this.$store.commit("SET_TOKEN",token);
                  this.$router.replace('/sys')
                  this.loading = false
                }
                }).catch(() => {this.loading = false})
            } else {
              console.log('error submit!!')
              return false
            }
          })
        }
      }
    }
</script>
    
<style>
    .login-form {
        position: relative;
        width: 400px;
        max-width: 100%;
        padding: 35px 50px 10px;
        margin: 0 auto;
        overflow: hidden;
        background-color: #283443;
        border-radius: 8px;
        opacity: 0.9;
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
    .login-container {
        min-height: 100%;
        width: 100%;
        background-color: #2d3a4b;
        overflow: hidden;
    
        background-image: url('../assets/KON.jpg');
        background-size: 100%;
    
        display: flex;
        align-items: center;
    }
    .title-container {
        position: relative;
    }
    .title {
        font-size: 26px;
        color: #eee;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
    }
</style>
    