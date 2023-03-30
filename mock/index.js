const Mock = require('mockjs')
Mock.mock('http://localhost:9999/user/login', 'post', (param) => {
    let body = JSON.parse(param.body);
    let code, message, data;
    //模拟用户名和密码都是 admin
    if (body.username == 'admin' && body.password == '123456') {
        code = 20000;
        message = 'success'
        data = Mock.mock({
            "token": "@guid()", //模拟token
        });
    } else {
        code = 20001;
        message = 'wrong'
        data = null
    }
    return {
        "code": code,
        "data": data,
        "message": message
    }
});

Mock.mock('http://localhost:9999/user/list', 'get', (param) => {
    let body = JSON.parse(param.body);
    let code, message, data;
    code = 20000
    data = Mock.mock({
        rows: [{
            email: "11@11.com",
            id: 9,
            phone: null,
            status: 1,
            username: "test"
        }],
        total: 1
    })
    return {
        "code": code,
        "data": data
    }
})