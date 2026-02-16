# Task CLI Tutorial

Natural language task management from the terminal.

## Overview

Task CLI understands natural language to create, manage, and track tasks without memorizing commands.

## Basic Usage

```bash
# Add tasks naturally
task-cli "Review pull request from Sarah by Friday"
task-cli "Buy groceries tomorrow morning"
task-cli "Call dentist at 2pm next Tuesday"

# List tasks
task-cli list
task-cli list --today
task-cli list --overdue

# Complete tasks
task-cli done 1
task-cli complete "review pull request"
```

## Example

```bash
# Create tasks with natural language
$ task-cli "Write documentation by end of week"
✓ Created task #1: Write documentation
  Due: 2026-02-23 (end of week)

$ task-cli "Fix bug in authentication module, high priority"
✓ Created task #2: Fix bug in authentication module
  Priority: HIGH

# View tasks
$ task-cli list
ID  Task                           Due         Priority  Status
--  ----                           ---         --------  ------
2   Fix bug in authentication      Today       HIGH      ⏳
1   Write documentation            Feb 23      NORMAL    ⏳

# Complete a task
$ task-cli done 2
✓ Completed task #2
```

## Tips

- Dates are parsed automatically: "tomorrow", "next week", "in 3 days"
- Priority keywords: "urgent", "high priority", "low priority"
- Use `task-cli search "keyword"` to find tasks
- Export tasks: `task-cli export --format json`
