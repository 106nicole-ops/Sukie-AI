import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  // --- 1. THE HOOK (开场与认知重构) ---
  {
    id: 'h1',
    category: 'hook',
    title: '客户对品牌陌生',
    subtitle: 'Nike 法则 / 权威暗示',
    tags: ['权威暗示', '潜意识植入'],
    oneLiner: '“我在 Nike 工作，绝对不会问客户听过 Nike 没。”',
    logic: '绝不问“您听过宏利吗？”，这会显得弱势。利用“潜意识植入”，默认对方没听过是因为我们太低调（做实事），并用全球四地上市的硬实力进行降维打击。',
    sop: `“李先生，其实您没太听说过宏利是很正常的。

过去这一百多年，宏利是香港最大的养老金管理商，我们帮香港政府和市民管养老钱，在这个领域已经吃透了，所以之前确实没像友邦那样花大价钱在内地打广告。

但论实力，我们是全球唯一在纽、港、菲、加四地同时上市的金融集团。就像大家都穿耐克鞋一样，香港市民的退休金大部分都是我们在打理，跟政府兜底的程度非常深。”`
  },
  {
    id: 'h2',
    category: 'hook',
    title: '觉得保险是消费',
    subtitle: '金融房产论 / 资产保值',
    tags: ['资产保值', '具象化'],
    oneLiner: '“房子会生锈老旧，但金融房产越住越丰厚。”',
    logic: '将无形的“保险”具象化为有形的“房产”，利用中国人对房产的执念。强调“收租”功能且没有折旧、维修成本。',
    sop: `“这就好比我们在香港为您置办了一套‘金融房产’。

普通房子住了几十年会变旧、要维修，甚至会因为地段变差而贬值。

但我们这个‘金融账户’，您只需要供款5年，第6年开始它就自动为您‘收租’，而且这套房子永远是新的，租金还会逐年递增，直至传给您的孙辈。”`
  },
  {
    id: 'h3',
    category: 'hook',
    title: '询问预算太尴尬',
    subtitle: '高锚点试探法',
    tags: ['锚定效应', '博弈'],
    oneLiner: '“多了不好意思说，少了也不好意思说，直接抛锚点。”',
    logic: '直接问预算客户会防备。通过抛出一个较高的“锚点数字”（如15万美金），观察客户反应（是嫌贵还是默认），倒逼出真实预算区间。',
    sop: `“王总，基于我对您家庭结构和资产配置需求的初步判断...

通常像您这样的情况，我会建议先做一个年缴15万美金的方案。

您觉得这个量级是合适，还是我们需要调整一下？”`
  },

  // --- 2. OBJECTION (深度异议处理) ---
  {
    id: 'o1',
    category: 'objection',
    title: '比起比特币/黄金收益低',
    subtitle: '六边形战士 / 综合性能',
    tags: ['恐惧失控', '确定性偏好'],
    oneLiner: '“黄金怎么变现？拿菜刀砍吗？”',
    logic: '承认收益不如高风险资产，但攻击对方的短板（流动性、传承难度）。强调保险是“底仓”和“防火墙”，是六边形战士，而非单一收益冠军。',
    sop: `“李先生，单纯比收益率，保险永远跑不过比特币，这点我完全认同。

但黄金和币没法无损传承。试想一下，未来您想把2000万黄金传给孩子，难道真在家里拿菜刀砍成几块吗？

我们的产品是‘六边形战士’。它可能不是单项冠军，但在安全性、隐私保护、无损传承和法律隔离上，它是综合得分最高的。无论外面赌场还在不在，您的底仓永远都在。”`
  },
  {
    id: 'o2',
    category: 'objection',
    title: '担心政治风险/卷款跑路',
    subtitle: '天气预报论 / 风险对冲',
    tags: ['风险对冲', '底线思维'],
    oneLiner: '“天气预报都不准，所以我们要带伞。”',
    logic: '承认未来不可预测，消解宏大叙事的焦虑。将焦点拉回“当下的准备”。既然不确定，更要鸡蛋分篮。',
    sop: `“您的担心非常有远见。确实，就像天气预报都未必准一样，谁也不敢保证未来几十年会发生什么。

但正因为未来不确定，我们才更要在当下做好多手准备。

您把鸡蛋都放在一个篮子里风险大，还是分一部分到受国际法保护的离岸账户里更安全？我们做的是防御，不是预测。”`
  },
  {
    id: 'o3',
    category: 'objection',
    title: '担心公司倒闭/破产',
    subtitle: '大而不倒 / 再保险机制',
    tags: ['政府兜底', '安全感'],
    oneLiner: '“保险公司允许破产，但不允许倒闭跑路。”',
    logic: '区分倒闭（清算）与破产（重组）。引用历史案例（AIA），强调保监局强制接管机制，客户利益0损失。',
    sop: `“在保险法里，保险公司是被允许‘破产’（重组），但不允许‘倒闭’（清算跑路）。

即便发生极端的破产情况，监管局会强制指定另一家大型保险公司全盘接收所有保单，您的权益会继续履行。

这在历史上是有案可查的，比如当年的AIA事件，客户的保单利益从未受损。这就是保险和其他金融产品最大的区别——它有托底。”`
  },
  {
    id: 'o4',
    category: 'objection',
    title: '质疑7%回报率真实性',
    subtitle: '不可能三角 / 群体信任',
    tags: ['理性逻辑', '群体背书'],
    oneLiner: '“如果我写保证，那就是庞氏骗局。”',
    logic: '1. 行业底线：7%是平均水平。2. 反向销售：敢写保证就是非法集资。3. 利益绑定：我们管着全香港人的养老金，比你更输不起。',
    sop: `“李先生，如果有人敢给您白纸黑字‘保证’7%的收益，那大概率是骗局。

这7%不是拍脑袋决定的，而是全香港保险业的平均投资水平。宏利聘请了年薪5000万的精算团队来计算这个数据。

更重要的是，我们管理着香港人的强积金（养老金），如果我们达不到，整个香港养老体系都会出问题。我们是在举全公司之力维护这个信誉。”`
  },
  {
    id: 'o5',
    category: 'objection',
    title: 'CRS税务透明/金税四期',
    subtitle: '承认与规避 / 游戏规则',
    tags: ['合规', '隐私'],
    oneLiner: '“交换不代表要罚款，况且我们有信托。”',
    logic: '承认CRS存在，但强调交换信息的滞后性和“交换不等于征税”。提出解决方案：换身份、信托架构。',
    sop: `“CRS只是一个信息交换系统，交换并不代表要罚款。

而且，针对大额资产，我们有更高级的玩法，比如更换非中国税务居民身份，或者在香港设立信托架构。

我们的产品天然具有隐私保护属性，前5-8年是封闭期，没有收益产生，自然也就没有所谓的‘税基’。我们有充足的时间帮您做税务筹划。”`
  },

  // --- 3. CLOSING (促单与升维) ---
  {
    id: 'c1',
    category: 'closing',
    title: '宝妈客户犹豫不决',
    subtitle: '责任转嫁 / 解脱感',
    tags: ['解脱感', '母爱'],
    oneLiner: '“谁想实打实掏腰包交学费？反正我不愿意。”',
    logic: '将“买保险”重新定义为“转嫁责任”。不仅仅是理财，而是“外包”未来的压力，让自己现在更轻松。',
    sop: `“其实做这个计划，不是为了花钱，而是为了把未来的压力‘外包’出去。

您现在辛苦一点，把未来孩子出国留学、创业的几十万美金开支，全部转嫁给保险公司去承担。

到时候您只需要负责爱孩子，而我们要负责给孩子掏钱。这难道不是给自己最好的减负吗？”`
  },
  {
    id: 'c2',
    category: 'closing',
    title: '觉得供款压力大',
    subtitle: '紧裤腰带理论 / 延迟满足',
    tags: ['延迟满足', '极简时空'],
    oneLiner: '“勒紧裤腰带5年，换一辈子裤腰随便长。”',
    logic: '用极简的时间概念（5年 vs 一辈子），缩小客户当下的痛苦感知，放大未来的收益画面。',
    sop: `“这个计划其实很简单，就是咱们一起‘勒紧裤腰带’过这5年。

这5年您可能少买几个包、少换一次车，但5年之后，您就彻底自由了。

这笔钱已经像滚雪球一样在帮您工作了。用5年的克制，换未来一辈子的从容，这笔账是不是很划算？”`
  },
  {
    id: 'c3',
    category: 'closing',
    title: '高净值客户资产隔离',
    subtitle: '隐私防火墙 / 安全感',
    tags: ['安全感', '隐私'],
    oneLiner: '“即使被强制执行，这笔钱也是稳稳的。”',
    logic: '在合规边缘试探。不直接承诺违法的事，但强调“物理隔离”、“隐私保护”和“债务分离”。这是最后的底牌。',
    sop: `“李总，这笔资产最大的价值在于‘物理隔离’。

它在法律上与您的企业经营风险、婚姻债务风险是完全切断的。

即使内地发生任何债务纠纷，香港极其严格的《隐私法》和英美法系架构，能确保这笔钱安安稳稳地待在您的名下，谁也查不到，谁也动不了。”`
  }
];

export const SYSTEM_INSTRUCTION = `
You are Sukie Su, a top-tier Hong Kong insurance sales trainer known for a "sharp, counter-intuitive, and high-dimension" sales style (Warlord Style).
Your goal is to reframe the customer's cognition, not just answer questions.

**Your Persona:**
- **Confident & Dominant:** You don't beg for business. You are an expert. Customers need you more than you need them.
- **Metaphor Master:** You use concepts like "Financial Real Estate", "Hexagon Warrior", "Nike Rule", "Weather Forecast".
- **Logic:** You never get trapped in low-level comparisons (ROI vs Bitcoin). You elevate to "Safety, Inheritance, Liquidity, Privacy".
- **Tone:** Professional, slightly aggressive but charming, logical, direct.
- **Philosophy:** "We are on an assembly line. If a nail (customer) is hard to hammer, hit it twice. If still hard, throw it away. Next."

**Handling Objections:**
1. **Acknowledge:** Validate their feeling but not their logic.
2. **Reframe (The Hook):** Use a shocking one-liner or metaphor.
3. **Attack/Educate:** Explain the high-dimension logic (Privacy, Asset Isolation, etc.).
4. **Close:** Give a specific instruction or solution.

**Specific Knowledge Base (Do not hallucinate outside this):**
- **Manulife (宏利):** Top MPF manager in HK. Listed in NY, HK, Toronto, Philippines. "We don't advertise because we are the infrastructure."
- **Returns:** ~7% is industry standard. Guaranteed returns are scams.
- **Safety:** HK Insurance Authority guarantees takeovers. Companies can bankrupt (restructure) but cannot close down (liquidate client assets).
- **Bitcoin/Gold:** Good for speculation, bad for inheritance (cannot cut gold bar with a knife). Insurance is the "Base Camp".

**Output format:**
Always answer in Chinese. Keep it punchy. Use formatting for readability.
`;
