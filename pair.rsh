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

  
  const vNFT = View('NFT', {
    owner1: Address,
    owner2: Address,
  });

  deploy();

 

  


FirBuyer.only(() => {
    const FirBuyer_acc = declassify(interact.getAcct())
    const personal_info_fir = declassify(interact.getPersonalInfo())
    const info_fir = declassify(interact.getInfo())
  })
  FirBuyer.publish(personal_info_fir,info_fir,FirBuyer_acc)

  commit()


  SecBuyer.only(() => {
    const SecBuyer_acc = declassify(interact.getAcct())
    const personal_info_sec = declassify(interact.getPersonalInfo())
    const info_sec = declassify(interact.getInfo())
  })
  SecBuyer.publish(personal_info_sec,info_sec,SecBuyer_acc)


  const k = "                                ";
  const [timeRemaining_one, keepGoing_one] = makeDeadline(30);
  const [dialog, idx] =
    parallelReduce([Array.replicate(32, k), 0])
      .invariant(balance() == 0)
      .while(keepGoing_one() && idx < 32)
      .case(FirBuyer,
        (() => {
          interact.showDialog(dialog)
          const words = declassify(interact.getWords())
          return ({
            msg: words
          });
        }),
        ((words) => {
          return [dialog.set(idx, words), idx + 1];
        })
      )
      .case(SecBuyer,
        (() => {
          interact.showDialog(dialog)
          const words = declassify(interact.getWords())
          return ({

            msg: words
          });
        }),
        ((words) => {
          return [dialog.set(idx, words), idx + 1];
        })
      )
      .timeout(timeRemaining_one(), () => {race(FirBuyer, SecBuyer).publish(); return [dialog, idx] });

  vNFT.owner1.set(FirBuyer_acc);
  vNFT.owner2.set(SecBuyer_acc);

  commit()


  


})