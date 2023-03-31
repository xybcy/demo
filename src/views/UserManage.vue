<template>
     <div class="login-container">
        <el-form ref="loginForm" >
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input
                        v-model="searchModel.username"
                        placeholder="用户名"
                        clearable
                    ></el-input>
                    <el-input
                        v-model="searchModel.phone"
                        placeholder="电话"
                        clearable
                    ></el-input>
                    <el-button
                        @click="getUerList"
                        type="primary"
                        round
                        icon="el-icon-search"
                    >查询</el-button>
                </el-col>

                <el-col :span="4" align="right">
                    <el-button
                        @click="$event => openEditUI(null)"
                        type="primary"
                        icon="el-icon-plus"
                        circle
                    ></el-button>
                    <el-button type="danger" @click="logout">注销</el-button>
                </el-col>


            </el-row>
        </el-card>

        <el-card>
            <el-table :data="userList" stripe style="width: 100%">
                <el-table-column label="#" width="80">
                    <template slot-scope="scope">
                        {{
                            (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index +1
                        }}
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="用户ID" width="180">
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="180">
                </el-table-column>
                <el-table-column prop="phone" label="电话" width="180">
                </el-table-column>
                <el-table-column prop="status" label="用户状态" width="180">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1">正常</el-tag>
                        <el-tag v-else type="danger">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="电子邮件"> </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button @click="$event => openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" size="mini" circle></el-button>
                        <el-button @click="$event => openEditUI(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--分页-->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchModel.pageNo"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="searchModel.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total= total
        >
        </el-pagination>
    </el-form>
    </div>
</template>

<script>
import '../../mock'
export default {
    data() {
        var checkEmail = (rule, value, callback) => {
            if(!reg.test(value)){
            return callback(new Error("邮箱格式错误"));
            }
            callback();
            
        }
        return{
            formLabelWid: "130px",
            userForm:{},
            dialogFormVisble: false,
            title:"",
            total:0,
            searchModel:{
                pageNo: 1,
                pageSize: 10,
            },
            userList:[],
            rules:{
                username:[
                    {requrired: true,message:"请输入用户名",trigger:"blur"},
                    {
                        min: 3,
                        max: 40,
                        message: "长度在3到40个字符",
                        trigger: "blur",
                    },
                ],
                password: [
                    { requrired: true,message:"请输入登录初始密码",trigger:"blur"},
                    {
                        min: 6,
                        max: 20,
                        message: "长度在6到20个字符",
                        trigger: "blur",
                    },
                ],
                email:[
                    { requrired: true,message:"请输入电子邮件",trigger:"blur"},
                    { validator:checkEmail, trigger:"blur"},
                ],
            },
        };
    },
    methods: {
        deleteUser(user){
            this.$confirm('您确认删除用户 ${user.username}?','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type: 'warning'
            }).then(() =>{
                userApi.deleteUserById(user.id).then(response =>{
                    this.$message({
                        type:'success',
                        message:response.message
                    });
                    this.getUserList();
                });

            }).catch(() =>{
                this.$message({
                    type:'info',
                    message:'已取消删除'
                });
            });
        },
        saveUser(){
            this.$refs.userFormRef.validate((valid) =>{
                if (valid){
                    userApi.$saveUser(this.userForm).then(response =>{
                        this.$message({
                            message:response.message,
                            type:'success'
                        });
                        this.dialogFormVisble = false;
                        this.getUserList();
                    });
                } else{
                    console.log("error submit!");
                    return false;
                }
            });
        },
        clearForm() {
            this.userForm= {};
            this.$refs.userFormRef.clearValidate();
        },
        openEditUI(id) {
            if(id == null){
                this.title = "新增用户";
            }else{
                this.title = "修改用户";
            }
            this.dialogFormVisble = true;
        },
        handleSizeChange(pageSize){
            this.searchModel.pageSize = pageSize;
            this.getUserList();
        },
        handleCurrentchange(pageNo){
            this.searchModel.pageNo = pageNo;
            this.getUserList();
        },
        getUserList() {
            let params={
                pageNo: this.searchModel.pageNo,
                pageSize: this.searchModel.pageSize,
                username: this.searchModel.username,
                phone: this.searchModel.phone
            }
            this.$http.get('/user/list',params).then((response) =>{
                const info = response.data
                if (info.code == 20000){
                    this.userList = info.data.rows;
                    this.total = info.data.total;
                }
            });
        },
        logout() {
            this.$store.commit("RESET_STATE");
            this.$router.push('/')
        }
    },
    created() {
        this.getUserList();
    },
};
</script>


<style>
 
#search .el-input {
    width: 200px;
    margin-right: 10px;
}
.el-dialog .el-input{
    width: "1100px"; 
    top: "10px";
    width: 85%;
    
}

    .login-container {
        min-height: 100%;
        width: 100%;
        background-color: #2d3a4b;
        overflow: hidden;
        background-image: url('../assets/bg.jpg');
        background-size: 100%;
    
        display: flex;
        align-items: center;
    }
</style>