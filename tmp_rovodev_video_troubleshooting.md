# YouTube Embed Error 153 - Troubleshooting Guide

## The Issue
Error 153 means "Video player configuration error" - this typically occurs when:
1. Videos are set to "Private" (must be Public or Unlisted)
2. Embedding is disabled in video settings
3. Videos have domain restrictions
4. Videos are age-restricted

## Videos to Check:
1. **Arcania Short**: https://youtu.be/zUjvpoeulSs
2. **Arcania Long**: https://youtu.be/Nmhs6U8127g
3. **Crypto Blasters Short**: https://youtu.be/5Is173XQeyg
4. **Crypto Blasters Long**: https://youtu.be/ayJOgFpfXtE
5. **Metaforza Short**: https://youtu.be/FiEdMhpgbAI
6. **Metaforza Long**: https://youtu.be/AiqVLIg834g
7. **Rampage**: https://youtu.be/KBXnfm4q1NU

## How to Fix on YouTube:

### For Each Video:
1. Go to YouTube Studio (studio.youtube.com)
2. Click on "Content" in the left sidebar
3. Find each video and click on it
4. Check **Visibility**:
   - Must be set to "Public" or "Unlisted" (NOT Private)
   
5. Scroll down to "Advanced settings" and check:
   - ✅ "Allow embedding" must be CHECKED/ENABLED
   - ✅ Remove any domain restrictions
   - ✅ Make sure video is NOT age-restricted

6. Click "SAVE"

## What I've Already Done:
- ✅ Changed all embeds to use `youtube-nocookie.com` (more permissive)
- ✅ Added `enablejsapi=1` parameter
- ✅ Updated both homepage videos and modal videos
- ✅ Kept all autoplay and loop settings

## Next Steps:
1. Check the privacy settings for all 7 videos above
2. Enable embedding for each video
3. Test the website after making changes
4. If issues persist, let me know which specific videos are still failing
