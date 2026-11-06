window.LAB_PASSWORDS={
  gates:{
    history:['pong'],
    good:['pacman'],
    brands:['breakout'],
    et:['pitfall'],
    crash:['centipede'],
    'crash-explanation':['adventure'],
    steam:['gta6','gtavi'],
    'today-examples':['battlepass'],
    exit:['slop'],
    arcade:['freeplay']
  },
  accepts(pageId,answer){
    const normalized=String(answer).toLowerCase().replace(/[^a-z0-9]/g,'');
    return (this.gates[pageId]||[]).includes(normalized);
  }
};
