# 群晖NAS共享服务器

## 介绍

现服务器于2024年6月27日上线，采用群晖Nas共享服务器部署在公司虚拟服务器PVE上，用于存储和共享公司内部的文件。IP地址为[192.168.150.250](http://192.168.150.250),也可以通过域名访问[https://nas.wjqflexus.com](https://nas.wjqflexus.com)

### 新版共享服务器相比旧版

1. 权限管理更完善、更细致
2. 安全性更高
3. 便利性更高
4. 备份机制更完善

所以需要更换到新版的服务器

### 新版的服务器配置

1. IP地址：192.168.150.250
2. 根据组织架构设立各部门的文件夹，本部门的人员只有访问本部门文件夹的权限，多部门共同使用的有单独的跨部门文件夹，如下图![explorer_au2FPJI8hS.png](https://pic.szphoenix.cn:15666/img/2024/06/27/667cc8c0b273c.png)
3. 每周自动查杀病毒---如果遇到文件莫名丢失，很可能是被误删除或者带毒被查杀了
4. 误删除回收站---如果遇到误删除，可以联系管理员帮忙恢复
5. 历史版本控制---常规办公文件可以进行历史版本恢复，默认保存8个 版本![msedge_GLnpYUiv7s.png](https://pic.szphoenix.cn:15666/img/2024/06/27/667cca6903a5c.png)

### 新版服务的使用

1. 所有人的账号为金蝶的账号，初始密码为Abcd1234
2. 首先更改密码
   1. 先用初始密码登录192.168.150.250![msedge_fITAgVtPwv.jpg](https://pic.szphoenix.cn:15666/img/2024/06/27/667ccd81e283e.jpg)
   2. 登录后点击右上角用户图标--个人设置![msedge_lKrrH9FelX.jpg](https://pic.szphoenix.cn:15666/img/2024/06/27/667ccdb68a01a.jpg)
   3. 点击修改密码，然后按个人喜好设置保存即可![msedge_2USfhnqokZ.png](https://pic.szphoenix.cn:15666/img/2024/06/27/667ccde77f759.png)
3. 后面就跟旧版的类似，只是多了登录的步骤
   1. 方式一：
      1. 桌面右键---新建---快捷方式，输入\\\192.168.150.250![explorer_mZyvBiPnvO.png](https://pic.szphoenix.cn:15666/img/2024/06/27/667ccec9917bc.png)
      2. 下一步，设置一个自己喜欢的名字保存即可![explorer_NPyIxfsaOB.png](https://pic.szphoenix.cn:15666/img/2024/06/27/667cced350cc1.png)
      3. 打开新建的快捷方式，就可以看到各部门的文件夹
      4. 双击自己部门的文件夹，会要求登录，输入账号密码勾选记住我的凭据，之后打开就不需要再输入账号密码了![explorer_6m2tYW7pa7.png](https://pic.szphoenix.cn:15666/img/2024/06/27/667ccfed72fc4.png)
      5. 然后就正常使用即可
   2. 方式二：
      1. windows键 + R打开“运行”，输入\\\192.168.150.250，后续同方法一
      2. 或者直接打开“我的电脑”，在上方输入框中输入也是同样的效果![explorer_ERV7wCxGqt.png](https://pic.szphoenix.cn:15666/img/2024/06/27/667cd1a942b2d.png)
      3. 方式三：映射网络驱动器
         1. 打开我的电脑-映射网络驱动器，我这里是win11，win10、win7类似，请自行查找点击入口![explorer_gDIahtJeGP.png](https://pic.szphoenix.cn:15666/img/2024/06/27/667cefcb1e379.png)
         2. 驱动器选择一个你喜欢的盘符就行，文件夹这里点击浏览，弹出一个选择对话框，向下拉，找到“wjqflexus”展开，然后选择自己需要的文件夹![explorer_R7OY8fwSMV.png](https://pic.szphoenix.cn:15666/img/2024/06/27/667cf0af1eab5.png)
         3. 确定后，会自动打开文件夹，同时“我的电脑”中会多出一个“盘”出来，之后就类似正常“C盘”、“D盘”一样使用即可![explorer_cDqB3qLWVd.png](https://pic.szphoenix.cn:15666/img/2024/06/27/667cf187b97e4.png)
         4. 这种办法只能单一部门文件夹映射，有多个部门或跨部门协作的同事再多映射一次就可以了

## 链接使用的方法其实还有很多，有感兴趣的同事，可以自行搜索“群晖NAS”

### 可能会遇到的问题

1. 某次打开共享服务器，要求再次登录，账号密码都对，却登录不上
   1. 一般是系统更新或某60导致的，进入到控制面板--用户账户--凭据管理器，删除保存的密码，最好重启下电脑，然后再执行一次登录，一般就能解决![explorer_AslyE284Ro.png](https://pic.szphoenix.cn:15666/img/2024/06/27/667cd2a8bde7f.png)

## 以上就是新版共享服务器的使用方法
