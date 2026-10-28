/* 무료 1장 타로: 카드 뒷면 부유→섞기→세 뭉치 선택 연출. 카드 추첨/앞면/해석은 후속 단계. */
(function(){
  'use strict';
  const root=document.querySelector('[data-free-tarot-root]');
  if(!root)return;
  const shell=document.createElement('div');shell.className='ft-shell';shell.dataset.phase='float';
  const title=document.createElement('h2');title.textContent='무료 1장 타로';
  const note=document.createElement('p');note.className='ft-note';note.setAttribute('aria-live','polite');note.textContent='공중에 떠 있는 카드들을 섞어 보세요.';
  const stage=document.createElement('div');stage.className='ft-stage';stage.setAttribute('aria-label','타로 카드 애니메이션');
  const controls=document.createElement('div');controls.className='ft-controls';
  const action=document.createElement('button');action.type='button';action.className='ft-action';action.textContent='카드 섞기';
  controls.append(action);shell.append(title,note,stage,controls);root.replaceChildren(shell);
  const count=25,cards=[];let phase='float',generation=0;
  const positions=[[-.31,-.06,-11],[0,.17,0],[.31,-.06,11]];
  const rand=(min,max)=>min+Math.random()*(max-min);
  function size(){return {w:stage.clientWidth,h:stage.clientHeight};}
  function floatCards(){
    generation++;phase='float';shell.dataset.phase=phase;stage.replaceChildren();cards.length=0;
    const {w,h}=size();
    for(let i=0;i<count;i++){
      const el=document.createElement('div');el.className='ft-card ft-floating';el.setAttribute('aria-hidden','true');
      const x=rand(-w*.42,w*.42),y=rand(-h*.37,h*.35);
      const values={'--x':x+'px','--y':y+'px','--z':rand(-90,80)+'px','--r':rand(-55,55)+'deg','--dx':rand(-35,35)+'px','--dy':rand(-30,30)+'px','--dr':rand(-20,20)+'deg','--dur':rand(2.5,5)+'s','--delay':rand(-5,0)+'s','--alpha':rand(.55,.95)};
      for(const [k,v] of Object.entries(values))el.style.setProperty(k,v);
      stage.append(el);cards.push(el);
    }
    action.disabled=false;action.hidden=false;action.textContent='카드 섞기';note.textContent='공중에 떠 있는 카드들을 섞어 보세요.';
  }
  function piles(){
    if(phase!=='float')return;
    phase='gather';shell.dataset.phase=phase;action.disabled=true;note.textContent='카드가 섞이며 세 뭉치로 모이고 있어요.';
    const {w,h}=size();
    cards.forEach((el,i)=>{
      const k=i%3,[fx,fy,fr]=positions[k];
      el.classList.remove('ft-floating');el.classList.add('ft-gather');
      el.style.setProperty('--tx',fx*w+'px');el.style.setProperty('--ty',fy*h+'px');el.style.setProperty('--tz',i*.25+'px');el.style.setProperty('--tr',(fr+rand(-7,7))+'deg');
    });
    const token=++generation;
    window.setTimeout(()=>{
      if(token!==generation||phase!=='gather')return;
      for(let k=0;k<3;k++){
        const [fx,fy,fr]=positions[k];const button=document.createElement('button');button.type='button';button.className='ft-pile';button.style.setProperty('--px',fx*w+'px');button.style.setProperty('--py',fy*h+'px');button.style.setProperty('--pr',fr+'deg');
        button.setAttribute('aria-label',(k+1)+'번째 카드 뭉치 선택');button.append(document.createElement('span'));
        button.addEventListener('click',()=>selectPile(button,k));stage.append(button);
      }
      phase='choose';shell.dataset.phase=phase;note.textContent='세 뭉치 중 하나를 선택해 주세요.';action.disabled=false;action.textContent='다시 섞기';
    },1350);
  }
  function selectPile(button,k){
    if(phase!=='choose')return;
    phase='selected';shell.dataset.phase=phase;
    button.classList.add('ft-picked');note.textContent=(k+1)+'번째 뭉치를 선택했어요. 카드 뽑기와 해석은 다음 제작 단계에서 연결됩니다.';
    action.textContent='다시 섞기';
  }
  action.addEventListener('click',()=>{if(phase==='float')piles();else floatCards();});
  floatCards();
})();
