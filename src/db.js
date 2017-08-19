import Sequelize from 'sequelize'
import _ from 'lodash'
import faker from 'faker'
const database = 'pgTest', username = 'pgAdmin', password = '28875117Dj'
const db = new Sequelize(
  database,
  username,
  password,
    {
      host: 'localhost',
      dialect: 'postgres'
    }
);

// def models
const User = db.define('user', {
  userName: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

const Comment = db.define('comment', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.STRING,
    allowNull: true
  }
})


// Association (belongsToMany, belongsTo, hasMany, hasOne)
// like: Profile.belongsTo(User) // This will add userId to the profile table
User.hasMany(Comment);
Comment.belongsTo(User);
// Comment.belongsTo(Comment); // 复杂的评论

// 数据库连接 
(async () => {
  // let result = await User.findAll()
  await db.sync({force: true})
  console.log(`Connected database ${database} success!`)
  
  // 新增 10个用户
  _.times(10, () => {
    return User.create({
      userName: faker.internet.userName()
    }).then(user => {
      user.createComment({
        title: `created by ${user.username}`,
        content: faker.lorem.sentence()
      })
    })
  })
})().catch(err => {
  console.log(err)
}); 

export default db