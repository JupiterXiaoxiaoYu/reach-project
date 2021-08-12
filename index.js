import React from 'react';
// import AppViews from './views/AppViews';
// import DeployerViews from './views/DeployerViews';
// import AttacherViews from './views/AttacherViews';
// import {renderDOM, renderView} from './views/render';
// import './index.css';
import * as buy from './build/buy.main.mjs';
import * as pair from './build/pair.main.mjs';
import * as rate from './build/rate.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib(process.env);
const { standardUnit } = reach;
const defaults = { defaultFundAmt: '100', standardUnit };
const NFTs = ['1.jpg', '2.jpg']

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { view: 'ConnectAccount', ...defaults };
    }
    async componentDidMount() {
        const acc = await reach.getDefaultAccount();
        const balAtomic = await reach.balanceOf(acc);
        const bal = reach.formatCurrency(balAtomic, 4);
        this.setState({ acc, bal });
        try {
            const faucet = await reach.getFaucet();
            this.setState({ view: 'FundAccount', faucet }); //水龙头
        } catch (e) {
            this.setState({ view: 'DeployerOrAttacher' }); //前往部署
        }
    }
    async fundAccount(fundAmount) {
        await reach.transfer(this.state.faucet, this.state.acc, reach.parseCurrency(fundAmount));
        this.setState({ view: 'DeployerOrAttacher' });
    }
    async skipFundAccount() { this.setState({ view: 'DeployerOrAttacher' }); }
    selectAttacher() { this.setState({ view: 'Wrapper', ContentView: Attacher }); }
    selectDeployer() { this.setState({ view: 'Wrapper', ContentView: Deployer }); }
    render() { return renderView(this, AppViews); }
}

class Player extends React.Component {
    random() { return reach.hasRandom.random(); }
    informTimeout() { this.setState({ view: 'Timeout' }); }
    showOwner(address, id) {
        const choice = Math.floor(Math.random() * 2)
        this.setState({ view: 'showNFT', acc: address, owner: id, NFT: choice })
    }
    getTime(time) { this.setState({ view: 'timeBuyNFT', time_point: time, love_score: love, career_score: career, fortune_score: fortune }); } //timeBuyNFT要放三个属性

    async getAcct() {
        return acc;
    }
    async getInfo() {
        return ctc;
    }
}


class Oracle extends Player {
    constructor(props) {
        super(props);
        this.state = { view: 'Deploy' };
    }

    async deployBuy() {
        const ctc = this.props.acc.deploy(buy);
        this.setState({ view: 'Deploying', ctc });
        // this.wager = reach.parseCurrency(this.state.wager); // UInt
        this.deadline = { ETH: 10, ALGO: 100, CFX: 1000 }[reach.connector]; // UInt
        buy.Oracle(ctc, this);
        const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
        this.setState({ view: 'WaitingForAttachers', ctcInfoStr });
    }

    async deployPair() {
        const ctc = this.props.acc.deploy(pair);
        this.setState({ view: 'Deploying', ctc });
        // this.wager = reach.parseCurrency(this.state.wager); // UInt
        this.deadline = { ETH: 10, ALGO: 100, CFX: 1000 }[reach.connector]; // UInt
        pair.Oracle(ctc, this);
        const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
        this.setState({ view: 'WaitingForAttachers', ctcInfoStr });
    }

    async deployRate() {
        const ctc = this.props.acc.deploy(rate);
        this.setState({ view: 'Deploying', ctc });
        // this.wager = reach.parseCurrency(this.state.wager); // UInt
        this.deadline = { ETH: 10, ALGO: 100, CFX: 1000 }[reach.connector]; // UInt
        rate.Oracle(ctc, this);
        const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
        this.setState({ view: 'WaitingForAttachers', ctcInfoStr });
    }



    render() { return renderView(this, DeployerViews); }


    setAttribute(love, career, fortune) { this.setState({ view: 'timeBuyNFT', time, love_score: love, career_score: career, fortune_score: fortune }) }
    async get_love() {
        this.love = reach.parseInt(this.state.love)
        return this.love
    }
    async get_career() {
        this.career = reach.parseInt(this.state.career)
        return this.career
    }
    async get_fortune() {
        this.fortune = reach.parseInt(this.state.fortune)
        return this.fortune
    }

}

//=============================================================================================


class FirBuyer extends Player {
    constructor(props) {
        super(props);
        this.state = { view: 'Attach' };
    }
    attachBuy(ctcInfoStr) {
        const ctc = this.props.acc.attach(backend, JSON.parse(ctcInfoStr));
        this.setState({ view: 'Attaching' });
        buy.FirBuyer(ctc, this);
    }

    attachPair(ctcInfoStr) {
        const ctc = this.props.acc.attach(backend, JSON.parse(ctcInfoStr));
        this.setState({ view: 'Attaching' });
        pair.FirBuyer(ctc, this);
    }

    attachRate(ctcInfoStr) {
        const ctc = this.props.acc.attach(backend, JSON.parse(ctcInfoStr));
        this.setState({ view: 'Attaching' });
        rate.FirBuyer(ctc, this);
    }

    async buyNFT(){
        const _time = new Date().toUTCString();
        this.setState({view:'showtime',_time})
        return time
    }

    async generat_id(){
        const id = stdlib.randomUInt();
        this.setState({view:'generate_id',id})
        return id
    }

    async showNFT(){
        const owner1 = ctc.getViews().vNFT.owner1()
        const love1 = ctc.getViews().vNFT.love1()
        const career1 = ctc.getViews().vNFT.career1()
        const fortune1 = ctc.getViews().vNFT.fortune1()
        this.setState({view:'showNFT',owner1,love1,career1,fortune1})
    }

    async getPersonalInfo(){
        this.personalInfo = JSON.parse(personalInfo)
        this.setState({view:'getPersonalInfo'})
        return this.personalInfo
    }

    async getWords(){
        this.Words = JSON.parse(Words)
        this.setState({view:'Viewdialog'})
        return this.Words
    }

    async getScore(){
        this.score = reach.parseInt(this.state.score)
        return this.score
    }

    async showChatInfo(chatInfo){
        this.setState('showChatInfo',chatInfo)
    }

    async getChatInfo(){
        this.ChatInfo = JSON.parse(ChatInfo)
        return this.ChatInfo
    }

    async showDialog(dialog){
        dialog.join("\n")
        this.setState('Viewdialog')
    }

    async showScore(score){
        this.setState('showScore',score)
    }
    render() { return renderView(this, AttacherViews); }
}


//==========================================================================



class SecBuyer extends Player {
    constructor(props) {
        super(props);
        this.state = { view: 'Attach' };
    }
    attachBuy(ctcInfoStr) {
        const ctc = this.props.acc.attach(backend, JSON.parse(ctcInfoStr));
        this.setState({ view: 'Attaching' });
        buy.SecBuyer(ctc, this);
    }

    attachPair(ctcInfoStr) {
        const ctc = this.props.acc.attach(backend, JSON.parse(ctcInfoStr));
        this.setState({ view: 'Attaching' });
        pair.SecBuyer(ctc, this);
    }

    attachRate(ctcInfoStr) {
        const ctc = this.props.acc.attach(backend, JSON.parse(ctcInfoStr));
        this.setState({ view: 'Attaching' });
        rate.SecBuyer(ctc, this);
    }

    async buyNFT(){
        const _time = new Date().toUTCString();
        this.setState({view:'showtime',_time})
        return time
    }

    async generat_id(){
        const id = stdlib.randomUInt();
        this.setState({view:'generate_id',id})
        return id
    }

    async showNFT(){
        const owner2 = ctc.getViews().vNFT.owner2()
        const love2 = ctc.getViews().vNFT.love2()
        const career2 = ctc.getViews().vNFT.career2()
        const fortune2 = ctc.getViews().vNFT.fortune2()
        this.setState({view:'showNFT',owner2,love2,career2,fortune2})
    }

    async getPersonalInfo(){
        this.personalInfo = JSON.parse(personalInfo)
        this.setState({view:'getPersonalInfo'})
        return this.personalInfo
    }

    async getWords(){
        this.Words = JSON.parse(Words)
        this.setState({view:'Viewdialog'})
        return this.Words
    }

    async getScore(){
        this.score = reach.parseInt(this.state.score)
        return this.score
    }

    async showChatInfo(chatInfo){
        this.setState('showChatInfo',chatInfo)
    }

    async getChatInfo(){
        this.ChatInfo = JSON.parse(ChatInfo)
        return this.ChatInfo
    }

    async showDialog(dialog){
        dialog.join("\n")
        this.setState('Viewdialog')
    }

    async showScore(score){
        this.setState('showScore',score)
    }
    render() { return renderView(this, AttacherViews); }
}

renderDOM(<App />);
