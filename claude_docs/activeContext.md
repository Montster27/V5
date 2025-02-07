# Active Context

## Current Status
- Basic game engine running with time management
- Resource system implemented 
- UI showing time and resource bars
- EventManager and EventService set up with empty pool

## Recent Changes
1. Added resource generation/consumption in TimeManager
2. Implemented resource display in GameRoot
3. Set up hourly/daily resource updates

## Current Error
Error: this.skillManager.getState is not a function
- Event system trying to access skillManager but not properly initialized

## Next Steps
1. Fix SkillManager constructor in EventManager
2. Update EventService to handle missing skills
3. Implement proper skill state management