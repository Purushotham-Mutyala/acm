# Git Exercises Completion 🎯

I successfully completed the [Git Exercises](https://gitexercises.fracz.com/) by Wojciech Frącz, which provided an excellent hands-on way to master Git concepts through practical challenges.

## 🚀 About the Exercises
A series of progressively challenging Git tasks covering:
- Basic commits & branching
- Rebasing and merging
- Interactive rebasing
- Resolving conflicts
- Stashing changes
- And more!

## 💡 Key Learnings
1. **Git Bisect**  
   Learned to efficiently hunt bugs through commit history using `git bisect` (see my [bisect example](image.png))

2. **Rewriting History**  
   Mastered interactive rebasing (`rebase -i`) to clean up commit histories

3. **Conflict Resolution**  
   Gained confidence in resolving merge conflicts through practice

4. **Stash Workflow**  
   Understood when to use `git stash` vs creating temporary branches

## 🧗 Challenges Faced
- **Level 5 (Fix Old Typo):**  
  Struggled with rebasing commits while preserving changes  
  *Solution:* Learned to use `git rebase -i` with `edit` instead of `amend`

- **Level 8 (Find Bug):**  
  Initially failed to properly use `git bisect`  
  *Breakthrough:* Created automated test scripts for bisect (`git bisect run`)

## 🔍 How I Solved Problems
Developed effective troubleshooting techniques:
1. **Precise Googling**  
   Used targeted searches like "git rebase preserve changes" instead of generic terms
   
2. **Visualizing History**  
   Used `git log --graph --oneline --all` to understand branch structures

## 🛠️ Technical Highlights
```bash
# Most valuable commands learned:
git bisect run 
git rebase -i HEAD~
git stash --include-untracked
git commit --amend --no-edit
