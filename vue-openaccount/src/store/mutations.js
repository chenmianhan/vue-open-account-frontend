// 提交 mutations是更改Vuex状态的唯一合法方法
export const modifyUserInfo = (state, userInfo) => {
	state.userInfo = userInfo
}

export const modifyAnswer = (state, answer) => {
	state.answer = answer
}

export const modifyAccountType = (state, accountType) => {
	state.accountType = accountType
}

export const modifyJob = (state, point) => {
	state.point = point
}

// export const modifyRole = (state, role) => {
// 	state.role = role
// }

// export const modifyToday = (state, today) => {
// 	state.today = today
// }

// // export const modifyComponents = (state, components) => {
// // 	state.modifyComponents = components
// // }

// // export const modifyProjects = (state, projects) => {
// // 	state.modifyProjects = projects
// // }

// export const modifyDataset = (state, dataset) => {
// 	state.modifyDataset = dataset
// }
