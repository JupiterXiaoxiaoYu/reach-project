'reach 0.1';

export const main = Reach.App(() => {


  const Player = {
    ...hasRandom,
    informTimeout: Fun([], Null),
    getAcct: Fun([], Address),
    getInfo: Fun([], Address),
  };

  const Oracle = Participant('Oracle', {
    ...Player,
  });

  const Buyer = {
    ...Player,
    informPledged: Fun([UInt, UInt], Null),
    getPersonalInfo: Fun([], Bytes(32)),
    getWords: Fun([], Bytes(32)),
    getScore: Fun([], UInt),
    showChatInfo: Fun([Bytes(32)], Null),
    getChatInfo: Fun([], Bytes(32)),
    showDialog: Fun([Array(Bytes(32), 32)], Null),
    showScore:Fun([UInt],Null)
  };

  const FirBuyer = Participant('FirBuyer',
    {
      ...Buyer
    }
  )

  const SecBuyer = Participant('SecBuyer',
    {
      ...Buyer
    }
  )

  deploy()


    const fee = 100;

Oracle.pay(fee*2)
commit()

FirBuyer.only(() => {
    const FirBuyer_acc = declassify(interact.getAcct())
    const _score_fir = interact.getScore();
    const [_commitmemt_fir, _salt_fir] = makeCommitment(interact, _score_fir);
    const commitmemt_fir = declassify(_commitmemt_fir)
  })
  FirBuyer.publish(commitmemt_fir,FirBuyer_acc)
  commit()


  unknowable(SecBuyer, FirBuyer(_score_fir, _salt_fir))

  SecBuyer.only(() => {
    const SecBuyer_acc = declassify(interact.getAcct())
    const score_sec = declassify(interact.getScore());
  })
  SecBuyer.publish(score_sec,SecBuyer_acc)
  commit()

  FirBuyer.only(() => {
    const [salt_fir, score_fir] = declassify([_salt_fir, _score_fir])
  })
  FirBuyer.publish(salt_fir, score_fir);
  checkCommitment(commitmemt_fir, salt_fir, score_fir)

  
  if (score_fir >= 8 && score_sec >= 8) {
    commit()
    FirBuyer.only(() => {
      const chatInfo_fir = declassify(interact.getChatInfo())
    })
    FirBuyer.publish(chatInfo_fir)
    commit()

    SecBuyer.only(() => {
      const chatInfo_sec = declassify(interact.getChatInfo())
      interact.showChatInfo(chatInfo_fir);
    })
    SecBuyer.publish(chatInfo_sec)
    commit()

    FirBuyer.only(() => {
      interact.showChatInfo(chatInfo_sec);
    })
    FirBuyer.publish()
    

  }
  if (score_fir <= 10 && score_sec <= 10 && balance() >= 20) {
    commit()

    SecBuyer.only(() => {
      interact.showScore(score_fir);
    })
    SecBuyer.publish()
    commit()

    FirBuyer.only(() => {
      interact.showScore(score_sec);
    })
    FirBuyer.publish()

    transfer(score_fir).to(SecBuyer_acc)
    transfer(score_sec).to(FirBuyer_acc)
  }

  /////

transfer(balance()).to(Oracle)
// commit();


commit()

})