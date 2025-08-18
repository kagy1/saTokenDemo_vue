import { ElCard, ElRow, ElCol, ElButton, ElTag, ElProgress, ElTimeline, ElTimelineItem, ElIcon } from 'element-plus'
import { defineComponent, ref, onMounted, computed } from 'vue'
import { User, Setting, Menu, Clock, Bell, Monitor } from '@element-plus/icons-vue'
import style from "./style.module.scss"

export default defineComponent({
    setup(props, { slots, expose, emit, attrs }) {
        // 统计数据
        const statsData = ref([
            {
                title: '用户总数',
                value: 1234,
                icon: User,
                color: '#409EFF',
                bgColor: '#ecf5ff',
                change: '+12%',
                trend: 'up'
            },
            {
                title: '角色数量',
                value: 8,
                icon: Setting,
                color: '#67C23A',
                bgColor: '#f0f9ff',
                change: '+2',
                trend: 'up'
            },
            {
                title: '菜单项',
                value: 45,
                icon: Menu,
                color: '#E6A23C',
                bgColor: '#fdf6ec',
                change: '+5',
                trend: 'up'
            },
            {
                title: '系统配置',
                value: 23,
                icon: Setting,
                color: '#909399',
                bgColor: '#f4f4f5',
                change: '+1',
                trend: 'up'
            }
        ])

        // 最近活动数据
        const recentActivities = ref([
            {
                user: '张三',
                action: '登录系统',
                time: '2024-08-18 14:30:25',
                type: 'login',
                status: 'success'
            },
            {
                user: '李四',
                action: '修改了用户权限',
                time: '2024-08-18 14:25:12',
                type: 'edit',
                status: 'info'
            },
            {
                user: '王五',
                action: '新增了菜单项',
                time: '2024-08-18 14:20:08',
                type: 'add',
                status: 'success'
            },
            {
                user: '赵六',
                action: '删除了角色配置',
                time: '2024-08-18 14:15:30',
                type: 'delete',
                status: 'warning'
            },
            {
                user: '孙七',
                action: '登录系统',
                time: '2024-08-18 14:10:45',
                type: 'login',
                status: 'success'
            }
        ])

        // 系统状态数据
        const systemStatus = ref([
            { name: 'CPU使用率', value: 45, color: '#409EFF' },
            { name: '内存使用率', value: 68, color: '#67C23A' },
            { name: '磁盘使用率', value: 32, color: '#E6A23C' },
            { name: '网络负载', value: 78, color: '#F56C6C' }
        ])

        // 快捷操作
        const quickActions = ref([
            { title: '用户管理', icon: User, color: '#409EFF', path: '/user' },
            { title: '角色管理', icon: Setting, color: '#67C23A', path: '/role' },
            { title: '菜单管理', icon: Menu, color: '#E6A23C', path: '/menu' },
            { title: '系统设置', icon: Setting, color: '#909399', path: '/setting' }
        ])

        // 格式化时间
        const formatTime = (timeStr: string) => {
            const now = new Date()
            const time = new Date(timeStr)
            const diff = now.getTime() - time.getTime()
            const minutes = Math.floor(diff / (1000 * 60))

            if (minutes < 1) return '刚刚'
            if (minutes < 60) return `${minutes}分钟前`
            const hours = Math.floor(minutes / 60)
            if (hours < 24) return `${hours}小时前`
            const days = Math.floor(hours / 24)
            return `${days}天前`
        }

        // 当前时间
        const currentTime = ref(new Date().toLocaleString())

        onMounted(() => {
            // 更新时间
            setInterval(() => {
                currentTime.value = new Date().toLocaleString()
            }, 1000)
        })

        return () => (
            <div class={style.homepage}>
                {/* 欢迎横幅 */}
                <div class={style.welcomeBanner}>
                    <div class={style.bannerContent}>
                        <div class={style.welcomeText}>
                            <h1>欢迎使用通用权限认证系统</h1>
                            <p>今天是一个美好的一天，开始您的工作吧！</p>
                            <div class={style.timeInfo}>
                                <ElIcon><Clock /></ElIcon>
                                <span>当前时间：{currentTime.value}</span>
                            </div>
                        </div>
                        <div class={style.bannerIcon}>
                            <ElIcon size={60}><Setting /></ElIcon>
                        </div>
                    </div>
                </div>

                {/* 统计卡片 */}
                <ElRow gutter={20} class={style.statsRow}>
                    {statsData.value.map((item, index) => (
                        <ElCol span={6} key={index}>
                            <ElCard class={style.statsCard} shadow="hover">
                                <div class={style.statsContent}>
                                    <div class={style.statsInfo}>
                                        <h3>{item.title}</h3>
                                        <div class={style.statsValue}>{item.value}</div>
                                        <div class={style.statsChange}>
                                            <ElIcon><Setting /></ElIcon>
                                            <span>{item.change}</span>
                                        </div>
                                    </div>
                                    <div class={style.statsIcon} style={{ backgroundColor: item.bgColor }}>
                                        <ElIcon size={24} color={item.color}>
                                            <item.icon />
                                        </ElIcon>
                                    </div>
                                </div>
                            </ElCard>
                        </ElCol>
                    ))}
                </ElRow>

                <ElRow gutter={20} class={style.contentRow}>
                    {/* 系统状态 */}
                    <ElCol span={12}>
                        <ElCard class={style.contentCard} shadow="hover">
                            {{
                                header: () => (
                                    <div class={style.cardHeader}>
                                        <span>系统状态监控</span>
                                        <ElIcon><Monitor /></ElIcon>
                                    </div>
                                ),
                                default: () => (
                                    <div class={style.systemStatus}>
                                        {systemStatus.value.map((item, index) => (
                                            <div class={style.statusItem} key={index}>
                                                <div class={style.statusLabel}>
                                                    <span>{item.name}</span>
                                                    <span>{item.value}%</span>
                                                </div>
                                                <ElProgress
                                                    percentage={item.value}
                                                    color={item.color}
                                                    stroke-width={8}
                                                    show-text={false}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )
                            }}
                        </ElCard>
                    </ElCol>

                    {/* 最近活动 */}
                    <ElCol span={12}>
                        <ElCard class={style.contentCard} shadow="hover">
                            {{
                                header: () => (
                                    <div class={style.cardHeader}>
                                        <span>最近活动</span>
                                        <ElIcon><Bell /></ElIcon>
                                    </div>
                                ),
                                default: () => (
                                    <div class={style.recentActivities}>
                                        <ElTimeline>
                                            {recentActivities.value.map((activity, index) => (
                                                <ElTimelineItem
                                                    key={index}
                                                    timestamp={formatTime(activity.time)}
                                                    placement="top"
                                                    type={activity.status as any}
                                                >
                                                    <div class={style.activityItem}>
                                                        <div class={style.activityUser}>{activity.user}</div>
                                                        <div class={style.activityAction}>{activity.action}</div>
                                                    </div>
                                                </ElTimelineItem>
                                            ))}
                                        </ElTimeline>
                                    </div>
                                )
                            }}
                        </ElCard>
                    </ElCol>
                </ElRow>
            </div>
        )
    }
})